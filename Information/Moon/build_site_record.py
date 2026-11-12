"""
Build a lunar site comparison table + JSON records from QuickMap region exports.

HOW TO USE
 1. Put your QuickMap CSV exports in one folder (FOLDER below).
 2. Rename each file as   site__zone.csv   (two underscores between the parts), e.g.
        cabeus__floor.csv      cabeus__region.csv      cabeus__center_point.csv
        shackleton__rim.csv    haworth__floor.csv      malapert__ridge.csv
 3. Run:  python build_site_records.py
 Outputs: site_table.csv (one row per file, for Excel) and site_records.json (grouped by site).

Layers other than the usual ones (for example temperature or illumination, if your
export includes them) are kept automatically under "layers" in the JSON.
"""
import csv
import glob
import json
import os

FOLDER = "Information/Moon/quickmap_csv"
COARSE_PIXEL_M = 1500      # above this, QuickMap's stats are a coarse sample
POINT_SIZE_M = 100         # regions this small are treated as a single-point reading

# QuickMap layer ids -> short names used in the table
KEY_LAYERS = {
    "qts_demstack": "height_m",
    "qts_demstack_slope": "slope_deg",
    "ldrm_16": "roughness_100m",
    "lp_fe": "feo_wt_pct",
    "lp_h": "hydrogen_ug_g",
}


def num(text):
    """Convert text to a float; QuickMap writes -inf / inf / nan when there is no data."""
    try:
        value = float(text)
    except ValueError:
        return None
    if value in (float("inf"), float("-inf")) or value != value:
        return None
    return value


def read_export(path):
    meta = {"center": None, "size_m": None, "pixel_scale_m": None}
    layers = {}
    with open(path, newline="", encoding="utf-8-sig") as f:
        lines = f.read().splitlines()
    table_start = None
    for i, line in enumerate(lines):
        if line.startswith("#"):
            key, _, val = line[1:].partition("=")
            key, parts = key.strip().lower(), [num(p) for p in val.split(",")]
            if key == "center" and len(parts) == 2:
                meta["center"] = {"lon": parts[0], "lat": parts[1]}
            elif key.startswith("size") and len(parts) == 2:
                meta["size_m"] = parts
            elif key.startswith("pixel scale") and parts:
                meta["pixel_scale_m"] = parts[0]
        elif line.startswith("source,"):
            table_start = i
            break
    if table_start is None:
        raise ValueError(f"{os.path.basename(path)}: no data table found")
    for row in csv.DictReader(lines[table_start:]):
        layers[row["sourceId"]] = {
            "name": row["source"], "units": row["units"],
            "min": num(row["min"]), "max": num(row["max"]),
            "mean": num(row["mean"]), "sdev": num(row["sdev"]),
        }
    return meta, layers


def summarise(meta, layers):
    size = meta["size_m"] or [None, None]
    width_m = sum(s for s in size if s) / max([1, sum(1 for s in size if s)])
    px = meta["pixel_scale_m"]
    kind = "point" if width_m and width_m <= POINT_SIZE_M else "region"
    quality = "point reading" if kind == "point" else (
        "coarse sample" if px and px > COARSE_PIXEL_M else "ok")
    out = {"kind": kind, "diameter_km": round(width_m / 1000, 3) if width_m else None,
           "pixel_scale_m": px, "stats_quality": quality}
    for lid, short in KEY_LAYERS.items():
        layer = layers.get(lid)
        for stat in ("min", "max", "mean", "sdev"):
            out[f"{short}_{stat}"] = layer[stat] if layer else None
    h_min, h_max = out["height_m_min"], out["height_m_max"]
    out["relief_m"] = round(h_max - h_min, 1) if None not in (h_min, h_max) else None
    return out


def main():
    files = sorted(glob.glob(os.path.join(FOLDER, "*.csv")))
    if not files:
        raise SystemExit(f"No CSV files found in '{FOLDER}'.")
    rows, records = [], {}
    for path in files:
        stem = os.path.splitext(os.path.basename(path))[0]
        if "__" not in stem:
            print(f"Skipping {stem}.csv (rename it to site__zone.csv)")
            continue
        site, zone = stem.split("__", 1)
        meta, layers = read_export(path)
        summary = summarise(meta, layers)
        rows.append({"site": site, "zone": zone,
                     "center_lon": meta["center"]["lon"] if meta["center"] else None,
                     "center_lat": meta["center"]["lat"] if meta["center"] else None, **summary})
        records.setdefault(site, {"site": site, "zones": {},
                                  "temperature_min_K": None, "temperature_max_K": None,
                                  "illumination_percent": None})
        records[site]["zones"][zone] = {"center": meta["center"], **summary,
                                        "layers": {k: v for k, v in layers.items()}}
    if not rows:
        raise SystemExit("No correctly named files (site__zone.csv) were found.")

    with open("site_table.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    with open("site_records.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    cols = ["site", "zone", "kind", "diameter_km", "height_m_min", "height_m_max",
            "relief_m", "slope_deg_mean", "roughness_100m_mean", "stats_quality"]
    print(" | ".join(cols))
    for r in rows:
        print(" | ".join("-" if r[c] is None else str(r[c]) for c in cols))
    print("\nSaved site_table.csv and site_records.json")
    print("Reminder: 'coarse sample' rows are smoothed; trust their min/max and slopes less.")


if __name__ == "__main__":
    main()