import marimo

__generated_with = "0.10.19"
app = marimo.App()

@app.cell
def _():
    import marimo as mo
    import matplotlib.pyplot as plt
    import numpy as np
    return mo, plt, np

@app.cell
def _(mo):
    mo.md(
        """
        # Linear Algebra Playground: Vectors & Real-World Intuition

        Vectors don't just point in space; they hold **information**. 
        
        ## Example 1: Pure Mathematical Geometry
        Adjust the $x$ and $y$ components of the vector below to understand its standard mathematical representation as an arrow starting from the origin.
        """
    )
    return

@app.cell
def _(mo):
    x_math = mo.ui.slider(-5, 5, step=1, value=3, label="X component")
    y_math = mo.ui.slider(-5, 5, step=1, value=2, label="Y component")
    return mo.vstack([x_math, y_math]), x_math, y_math

@app.cell
def _(plt, x_math, y_math):
    fig1, ax1 = plt.subplots(figsize=(4, 4))
    xm, ym = x_math.value, y_math.value
    
    ax1.set_xlim(-6, 6)
    ax1.set_ylim(-6, 6)
    ax1.axhline(0, color='black', linewidth=0.5)
    ax1.axvline(0, color='black', linewidth=0.5)
    ax1.grid(True, linestyle='--', alpha=0.7)
    
    ax1.quiver(0, 0, xm, ym, angles='xy', scale_units='xy', scale=1, color='blue')
    ax1.scatter([xm], [ym], color='red')
    ax1.set_aspect('equal')
    
    plt.title(f"Mathematical Vector: [{xm}, {ym}]")
    return ax1, fig1, plt.show()

@app.cell
def _(mo):
    mo.md(
        """
        ---
        ## Example 2: Real-World Property Vectors

        Now imagine representing a physical object as a list of numbers. 
        Suppose we represent a **House** with two features:
        1. **Size** (in thousands of sq ft)
        2. **Age** (in decades)

        Move the sliders for Size and Age. Notice how houses with different profiles land in distinctly different areas of the "feature space."
        """
    )
    return

@app.cell
def _(mo):
    house_size = mo.ui.slider(1, 10, step=1, value=2, label="Size (K sqft)")
    house_age = mo.ui.slider(0, 10, step=1, value=1, label="Age (Decades)")
    return mo.vstack([house_size, house_age]), house_size, house_age

@app.cell
def _(plt, house_size, house_age):
    fig2, ax2 = plt.subplots(figsize=(5, 5))
    s, a = house_size.value, house_age.value
    
    ax2.set_xlim(0, 12)
    ax2.set_ylim(0, 12)
    ax2.set_xlabel("Size (Feature 1)")
    ax2.set_ylabel("Age (Feature 2)")
    ax2.grid(True, linestyle='--', alpha=0.5)
    ax2.axhline(0, color='black')
    ax2.axvline(0, color='black')

    # Draw the vector as a point in feature space
    ax2.scatter([s], [a], color='green', s=100, label="House Data Point")
    # Emphasize the vector arrow representing the data
    ax2.quiver(0, 0, s, a, angles='xy', scale_units='xy', scale=1, color='green', alpha=0.3)
    ax2.legend()
    
    plt.title(f"House Feature Vector: [ {s}, {a} ]")
    return ax2, fig2, plt.show()
