#!/usr/bin/env python3
"""Harvest fal.ai request history (inputs, outputs, prompts) into _reference/hatch-hero/.

Usage:  python3 scripts/fal_harvest.py [--since 2026-09-01] [--out _reference/hatch-hero]
Reads FAL_KEY from .env (never printed). Re-runnable: files already on disk are skipped.
Downloads go through curl in parallel — urllib gets its last few KB cut off by fal.media.
"""
import argparse, json, subprocess, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

API = "https://api.fal.ai/v1/models/requests/by-endpoint"
ENDPOINTS = [
    "fal-ai/nano-banana-pro/edit",
    "fal-ai/nano-banana-pro",
    "fal-ai/kling-video/v3/pro/image-to-video",
    "bytedance/seedance-2.0/image-to-video",
]
PARALLEL = 12


def load_key():
    for line in Path(".env").read_text().splitlines():
        if line.startswith("FAL_KEY="):
            return line.split("=", 1)[1].strip().strip("'\"")
    sys.exit("FAL_KEY missing in .env")


def get(url, key):
    req = urllib.request.Request(url, headers={"Authorization": f"Key {key}"})
    for attempt in range(4):  # the platform API occasionally 5xx's
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception:
            if attempt == 3:
                raise
            time.sleep(3 * (attempt + 1))


def list_requests(endpoint, since, key):
    cursor, items = None, []
    while True:
        q = {"endpoint_id": endpoint, "start": since, "limit": 100, "expand": "payloads"}
        if cursor:
            q["cursor"] = cursor
        d = get(f"{API}?{urllib.parse.urlencode(q)}", key)
        items += d.get("items", [])
        if not d.get("has_more"):
            return items
        cursor = d["next_cursor"]


def download(url, dest: Path):
    if dest.exists() and dest.stat().st_size > 0:
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(
        ["curl", "-sSfL", "--retry", "5", "--retry-all-errors", "--retry-delay", "2", "-o", str(dest), url],
        capture_output=True, text=True,
    )
    if r.returncode != 0 or not dest.exists():
        dest.unlink(missing_ok=True)
        print(f"  !! failed {url}: {r.stderr.strip()[:120]}")
        return False
    return True


def url_name(url):
    return urllib.parse.urlparse(url).path.rsplit("/", 1)[-1]


def collect_urls(obj, acc):
    """Walk a JSON payload and collect every fal.media URL."""
    if isinstance(obj, dict):
        for v in obj.values():
            collect_urls(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            collect_urls(v, acc)
    elif isinstance(obj, str) and obj.startswith("http") and "fal.media" in obj:
        acc.append(obj)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default="2026-09-01T00:00:00Z")
    ap.add_argument("--out", default="_reference/hatch-hero")
    a = ap.parse_args()
    key, out = load_key(), Path(a.out)
    inputs_dir, runs_dir = out / "inputs", out / "runs"
    manifest, jobs = [], []  # jobs: (url, dest), downloaded in parallel at the end

    for ep in ENDPOINTS:
        try:
            items = list_requests(ep, a.since, key)
        except Exception as e:
            sys.exit(f"{ep}: listing failed ({e}) — aborting so the manifest is not overwritten")
        print(f"{ep}: {len(items)} requests")
        for it in sorted(items, key=lambda x: x["started_at"]):
            rid, ts = it["request_id"], it["started_at"]
            ji, jo = it.get("json_input") or {}, it.get("json_output") or {}
            # full request id: UUIDv7 ids issued in the same second share their first 8 chars
            run = runs_dir / f"{ts[:19].replace(':', '-')}_{ep.replace('/', '_')}_{rid}"
            in_urls, out_urls = [], []
            collect_urls(ji, in_urls)
            collect_urls(jo, out_urls)
            in_files = []
            for u in in_urls:  # inputs are the references Cowork uploaded; keep their original names
                p = inputs_dir / url_name(u)
                jobs.append((u, p))
                in_files.append(p.name)
            out_files = []
            for i, u in enumerate(out_urls):
                p = run / f"out_{i}.{url_name(u).rsplit('.', 1)[-1]}"
                jobs.append((u, p))
                out_files.append(str(p.relative_to(out)))
            skip = ("prompt", "image_urls", "image_url", "negative_prompt", "end_image_url")
            rec = {
                "request_id": rid, "endpoint": ep, "started_at": ts, "status_code": it["status_code"],
                "duration": it["duration"], "prompt": ji.get("prompt"), "negative_prompt": ji.get("negative_prompt"),
                "params": {k: v for k, v in ji.items() if k not in skip}, "inputs": in_files, "outputs": out_files,
            }
            manifest.append(rec)
            if it["status_code"] == 200:
                run.mkdir(parents=True, exist_ok=True)
                (run / "request.json").write_text(json.dumps(rec, indent=2, ensure_ascii=False))

    print(f"\ndownloading {len(jobs)} files ({PARALLEL} parallel)…")
    with ThreadPoolExecutor(PARALLEL) as ex:
        new = sum(1 for ok in ex.map(lambda j: download(*j), jobs) if ok)
    print(f"  {new} new files")

    manifest.sort(key=lambda r: r["started_at"])
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    lines = ["# fal.ai harvest — index chronologique\n"]
    for i, r in enumerate(manifest, 1):
        p = (r["prompt"] or "").replace("\n", " ")
        lines.append(f"## {i:03d} · {r['started_at'][:16].replace('T', ' ')} · `{r['endpoint']}` · HTTP {r['status_code']}\n")
        lines.append(f"- inputs: {', '.join(r['inputs']) or '—'}")
        lines.append(f"- outputs: {', '.join(r['outputs']) or '—'}")
        lines.append(f"- params: `{json.dumps(r['params'])}`")
        lines.append(f"- prompt: {p[:400]}{'…' if len(p) > 400 else ''}\n")
    (out / "index.md").write_text("\n".join(lines))
    ok = sum(1 for r in manifest if r["status_code"] == 200)
    print(f"\n{len(manifest)} requests ({ok} OK) → {out}/manifest.json, index.md")


if __name__ == "__main__":
    main()
