#!/usr/bin/env python3
"""Run one fal.ai endpoint through the queue API and download its outputs.

Usage:
  python3 scripts/fal_run.py <endpoint> <out-prefix> --arg key=value … [--img url …] [--json '{...}']
Examples:
  python3 scripts/fal_run.py fal-ai/birefnet/v2 out/siege --arg image_url=https://… --arg model="General Use (Heavy)"
  python3 scripts/fal_run.py fal-ai/nano-banana-pro/edit out/scene --img https://a.png --img https://b.png \\
      --arg prompt="…" --arg resolution=2K --arg aspect_ratio=16:9 --arg output_format=png

--img urls go into `image_urls` (list). --arg values are strings unless they parse as JSON (numbers, booleans).
Reads FAL_KEY from .env (never printed). Prints the request id, then each downloaded file.
"""
import argparse, json, subprocess, sys, time, urllib.parse, urllib.request
from pathlib import Path


def load_key():
    for line in Path(".env").read_text().splitlines():
        if line.startswith("FAL_KEY="):
            return line.split("=", 1)[1].strip().strip("'\"")
    sys.exit("FAL_KEY missing in .env")


def call(method, url, key, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Authorization": f"Key {key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def collect_urls(obj, acc):
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
    ap.add_argument("endpoint")
    ap.add_argument("out", help="output path prefix, e.g. out/siege → out/siege_0.png")
    ap.add_argument("--arg", action="append", default=[], help="key=value (value parsed as JSON when possible)")
    ap.add_argument("--img", action="append", default=[], help="reference image url → image_urls[]")
    ap.add_argument("--json", help="raw JSON object merged into the input")
    ap.add_argument("--json-file", help="path to a JSON file merged into the input (for big payloads such as data URIs)")
    a = ap.parse_args()

    body = {}
    for kv in a.arg:
        k, v = kv.split("=", 1)
        try:
            body[k] = json.loads(v)
        except json.JSONDecodeError:
            body[k] = v
    if a.img:
        body["image_urls"] = a.img
    if a.json:
        body.update(json.loads(a.json))
    if a.json_file:
        body.update(json.loads(Path(a.json_file).read_text()))

    key = load_key()
    sub = call("POST", f"https://queue.fal.run/{a.endpoint}", key, body)
    rid = sub["request_id"]
    print(f"request {rid}")
    status_url, result_url = sub["status_url"], sub["response_url"]
    t0 = time.time()
    while True:
        st = call("GET", status_url, key)
        if st["status"] == "COMPLETED":
            break
        if st["status"] not in ("IN_QUEUE", "IN_PROGRESS"):
            sys.exit(f"status {st}")
        time.sleep(2)
        if time.time() - t0 > 600:
            sys.exit("timeout")
    res = call("GET", result_url, key)
    urls = []
    collect_urls(res, urls)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    (Path(a.out).parent / (Path(a.out).name + "_result.json")).write_text(json.dumps({"input": body, "output": res}, indent=2, ensure_ascii=False))
    for i, u in enumerate(urls):
        ext = urllib.parse.urlparse(u).path.rsplit(".", 1)[-1]
        dest = f"{a.out}_{i}.{ext}"
        subprocess.run(["curl", "-sSfL", "--retry", "5", "--retry-all-errors", "-o", dest, u], check=True)
        print(dest)
    print(f"done in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
