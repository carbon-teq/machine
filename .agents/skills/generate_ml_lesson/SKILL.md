---
name: generate_ml_lesson
description: Generates a complete ML lesson including MDX content, a static Manim image, and a Marimo notebook based on the curriculum specification.
---

# Generate ML Lesson Workspace Skill

This skill provides instructions on how to generate a complete learning module for the Machine Learning journey, strictly adhering to the **Math + ML Teaching Architecture**.

## Output Policy (Important)

- For math-based lessons, generate **images only** from Manim (`-s` static render).
- Do **not** generate lesson videos by default. Generate a Manim video only when the user explicitly asks for it.
- Keep the lesson pipeline stable and idempotent: re-running generation for the same topic should update the same artifacts in place.

## Prerequisites
You should have a specific subtopic to generate (e.g. "Matrix Multiplication" or "Gradient Descent").

## Workflow Steps

When asked to generate a lesson for a topic, you must follow these exact steps:

### 1. Plan the Content (The Narrative Arc)
Analyze the requested topic and structure it according to the **Narrative Arc** defined in `.cursor/rules/ml-teaching-architecture.mdc`.
**CRITICAL:** Do NOT use the phase names ("The Hook", "Geometric Intuition") as literal headings. The content must flow naturally.

1.  **The Hook:** What problem does this concept solve?
2.  **Geometric Intuition:** How do we visualize it?
3.  **Formal Notation:** How do we write it (LaTeX)?
4.  **Mechanics:** A simple worked example.
5.  **Application:** Real-world and ML relevance.

### 2. Generate the Manim Image
- Create or update a python file in `/home/hammad/projects/machine/python/scenes/[topic_slug].py`.
- Write a Manim `Scene` class that draws the **Geometric Intuition** concept.
- Use deterministic naming:
  - `topic_slug`: lowercase, words separated by `_` (example: `gradient_descent`)
  - scene class: `PascalCase` + `Scene` suffix (example: `GradientDescentScene`)
- Run static generation using uv (no preview): `cd /home/hammad/projects/machine/python && uv run manim -qm scenes/[topic_slug].py [SceneClassName] -s`
- Copy image to a deterministic web path:
  - Source: `/home/hammad/projects/machine/python/media/images/[topic_slug]/[SceneClassName].png`
  - Target: `/home/hammad/projects/machine/web/public/images/lessons/[topic_slug].png`
- Overwrite target atomically.

### 3. Generate the Marimo Notebook
- Create or update a new python file in `/home/hammad/projects/machine/python/notebooks/[topic_slug].py`.
- Structure the file as a valid Marimo notebook.
- The notebook should include interactive UI elements (`mo.ui.slider`, etc.) to let the user play with parameters related to the math concept.

### 4. Generate the Fuma Docs MDX Page
- Create or update a new MDX file in `/home/hammad/projects/machine/web/content/docs/[topic_slug].mdx`.
- **Strictly follow the writing style:**
    - Use the **Narrative Arc** structure (without explicit phase headings).
    - Use **LaTeX** for all math (`$ ... $`, `$$ ... $$`).
    - Use **Column Vectors** `\begin{bmatrix} ... \end{bmatrix}`.
    - distinct **Symbol Dictionary**.
- Embed the generated Manim image: `![Alt Text](/images/lessons/[topic_slug].png)`
- Provide a link to the Marimo notebook.

### 5. Verify Documentation
- Ensure the newly created MDX file is correctly linked in the `meta.json` if necessary.
- Check that the tone is conversational and "guide-like."

## Idempotent Conventions

1. **One topic -> one slug -> one canonical path set**
   - `python/scenes/[topic_slug].py`
   - `python/notebooks/[topic_slug].py`
   - `web/content/docs/[topic_slug].mdx`
   - `web/public/images/lessons/[topic_slug].png`
2. **No timestamped filenames**
3. **Safe overwrite behavior**
