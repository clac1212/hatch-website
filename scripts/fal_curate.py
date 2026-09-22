#!/usr/bin/env python3
"""Build _reference/hatch-hero/assets/ (clean, named files) from the raw fal harvest.

Run after scripts/fal_harvest.py. Validated references are the files Cowork re-uploaded
as inputs (turnarounds, 3/4 cutouts, empty rooms); finals are the last output per scene.
"""
import json, re, shutil
from pathlib import Path

ROOT = Path("_reference/hatch-hero")
IN, RUNS, OUT = ROOT / "inputs", ROOT / "runs", ROOT / "assets"
AGENTS = ["peep", "pecker", "lark", "jay", "finch", "sparrow", "owl"]
CLIENTS = {"nemesis": "nemesis", "pny": "pny", "afrik": "afrik-n-fusion", "nobinobi": "nobinobi", "meulerie": "la-meulerie"}
PREFIX = re.compile(r"^[A-Za-z0-9_-]{21}_")

manifest = json.load(open(ROOT / "manifest.json"))
manifest = [r for r in manifest if r["status_code"] == 200]


def latest_input(logical):
    """Most recently uploaded copy of a reference file (identical re-uploads, keep the last)."""
    for r in reversed(manifest):
        for n in r["inputs"]:
            if PREFIX.sub("", n) == logical:
                return IN / n
    return None


def last_output(pred):
    """Output of the last successful request matching pred(record)."""
    for r in reversed(manifest):
        if pred(r) and r["outputs"]:
            return ROOT / r["outputs"][0]
    return None


def inputs_of(r):
    return [PREFIX.sub("", n) for n in r["inputs"]]


def put(src, rel):
    if src is None:
        print(f"  -- missing: {rel}")
        return
    dst = OUT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    print(f"  {rel}")


if OUT.exists():
    shutil.rmtree(OUT)

print("agents/")
for a in AGENTS:
    put(latest_input(f"{a}_turnaround.png"), f"agents/{a}_turnaround.png")
    put(latest_input(f"{a}_34_white.png"), f"agents/{a}_34_white.png")
    put(last_output(lambda r, a=a: inputs_of(r) == [f"{a}_turnaround.png"] and "EXPRESSION" in (r["prompt"] or "")),
        f"agents/{a}_expressions.png")
put(latest_input("agents7_strip.png"), "agents/agents7_strip.png")
for a in ["jay", "finch", "sparrow", "owl"]:
    put(latest_input(f"swatch_{a}.png"), f"agents/swatches/swatch_{a}.png")
for a in ["peep", "pecker", "lark"]:
    put(latest_input(f"{a}_white.png"), f"agents/sprites-2d/{a}_white.png")

print("scenes/")
put(latest_input("dirB.png"), "scenes/fondatrice_terrasse_paris.png")
put(latest_input("dirB_alive.png"), "scenes/fondatrice_terrasse_paris_agents.png")
put(latest_input("face_office_empty.png"), "scenes/gabarit_bureau_vide_4x3.png")
put(latest_input("face_hq_empty.png"), "scenes/siege_large_vide.png")
put(latest_input("face_kitchen_empty.png"), "scenes/cuisine_vide.png")
put(latest_input("face_site_empty.png"), "scenes/chantier_vide.png")
put(latest_input("face_dev_empty.png"), "scenes/salle_reunion_vide_abandonnee.png")
put(last_output(lambda r: "face_hq_empty.png" in inputs_of(r)), "scenes/siege_large.png")
put(last_output(lambda r: "face_kitchen_empty.png" in inputs_of(r)), "scenes/cuisine.png")
put(last_output(lambda r: "face_site_empty.png" in inputs_of(r)), "scenes/chantier.png")
put(latest_input("d3_office.png"), "scenes/echec_3_pieces_un_prompt.png")

print("clients/")
for key, name in CLIENTS.items():
    put(last_output(lambda r, k=key: f"ref_{k}.png" in inputs_of(r)), f"clients/{name}.png")
    put(latest_input(f"ref_{key}.png"), f"clients/photos/{name}.png")

print("refs/")
for n in ["ref_gic_diorama.png", "ref_gic_nyc.png", "ref_cofounder_pixel.png", "ref_green_woodpecker.png",
          "scene_marked.png", "scene_clean.png"]:
    put(latest_input(n), f"refs/{n}")

print("video/")
for r in manifest:
    if "image-to-video" in r["endpoint"]:
        # the loop test fed start + end frame → 2 input images; the free test only the start frame
        tag = "seedance" if "seedance" in r["endpoint"] else ("kling_boucle" if len(r["inputs"]) == 2 else "kling_libre")
        put(ROOT / r["outputs"][0], f"video/{tag}_{r['request_id'][-6:]}.mp4")

# prompts of the final scenes + agents, for reuse
prompts = {}
for r in manifest:
    ins = inputs_of(r)
    for key, test in {
        "siege_large_vide": "face_office_empty.png" in ins and r["params"].get("aspect_ratio") == "16:9",
        "siege_large_agents": "face_hq_empty.png" in ins,
        "cuisine_agents": "face_kitchen_empty.png" in ins,
        "chantier_agents": "face_site_empty.png" in ins,
        "gabarit_bureau_vide": ins == ["dirB.png"],
        "client_devanture": "ref_gic_diorama.png" in ins,
    }.items():
        if test:
            prompts[key] = {"prompt": r["prompt"], "params": r["params"], "inputs": ins, "request_id": r["request_id"]}
(OUT / "prompts_finaux.json").write_text(json.dumps(prompts, indent=2, ensure_ascii=False))
print(f"\nprompts_finaux.json: {list(prompts)}")
