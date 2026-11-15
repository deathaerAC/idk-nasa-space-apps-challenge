# idk-nasa-space-apps-challenge
# Building from source
In this directory:
```ps1
  & ./build.ps1
```

## Moon report

**Source:** LROC QuickMap region exports. The terrain layer is listed as `qts_demstack`.

**Resolution and limitations:**
- Each export samples the region on a small grid, so large regions are coarse.
- Rows with spacing above 1,500 m are flagged as “coarse sample” and should be read as smoothed estimates.
- Hydrogen and iron come from 0.5° maps and describe the surrounding region, not the exact spot.

**To do:** Add temperature and illumination from other layers.