# Anam Cu Van Build - 3D Visualizer

Mobile-first, parametric 3D model of the Anam Cu Sprinter LWB grooming-van build.
Edit the van dimensions and the 3D model **and** the timber cut list both update
live. Built to visualise every cut before touching expensive timber.

Live: https://michalkubiak98.github.io/anamcu-van-3d/

## How it works

One editable `VanSpec` (all dimensions, mm) drives pure generators that produce a
`Part[]`, which feeds **both** the three.js scene and the cut list - a single
source of truth. Nothing is a hardcoded mesh.

- `src/data/defaultSpec.ts` - the measured van (from the Obsidian vault).
- `src/model/generators/*` - pure functions: `spec -> Part[]` (shell, floor frame, tank frame, fixtures).
- `src/model/cutlist/*` - first-fit-decreasing packing into the real 2.4 m sticks.
- `src/three/*` - react-three-fiber scene (hover/tap for dimensions, fixed 3D labels).
- `src/ui/*` - mobile bottom sheet: Layers / Dimensions / Cut list.

## Develop

```sh
npm install
npm run dev          # local dev
npm test             # cut-list parity test (vs the Python floor-frame output)
npm run build        # typecheck + production build
npm run preview      # serve the built dist with the correct base path
```

Pushing to `main` auto-deploys to GitHub Pages.

## Coordinate system

`x` = width (0 passenger/left -> driver/right), `y` = up (0 floor), `z` = length
(0 front/cabin -> rear/doors). All dimensions mm; converted to metres once at the
three.js boundary.
