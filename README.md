# ML Teaching Site

This repository contains teaching materials, interactive notebooks, Manim scenes, and a small web frontend that together form a learning environment for core machine learning and mathematics concepts.

**What’s in this repo**

- `web/` — Frontend site and static/public assets.
- `python/` — Manim scenes, helper scripts, and Python-side examples.
- `notebooks/` — Jupyter/experimental notebooks used for demonstrations and exploration.
- `scenes/` — Manim scene source files for generated images and animations.
- `scripts/` — Utility scripts used for rendering, validation, and deployment tasks.

**Quick start (developer-focused)**

1. Inspect the parts you want to run (web, Python, or notebooks) and follow the folder-level hints (`pyproject.toml`, `package.json`).

2. Web frontend (preferred package manager: `pnpm`):

```bash
cd web
pnpm install       # or `npm install` if you don't use pnpm
pnpm run dev       # or `npm run dev`
```

3. Python / Manim (use your preferred environment manager):

```bash
cd python
python -m venv .venv
source .venv/bin/activate
# Install dependencies according to python/pyproject.toml or your chosen tool
pip install -r requirements.txt  # if present
```

4. Rendering images and scenes:

```bash
cd python
./scripts/render_linear_algebra_images.sh
```

5. Notebooks: open the `notebooks/` folder in Jupyter or VS Code and run the examples interactively.

**Contributing**

Add changes on a branch and open a PR with a short description of what the update does and any runtime steps needed to verify it.

---
