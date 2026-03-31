import marimo

__generated_with = "0.20.4"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import numpy as np
    import plotly.graph_objects as go

    return go, mo, np


@app.cell
def _(mo):
    mo.md(r"""
    # Visualizing 3D Surfaces

    Welcome to the third dimension! In single-variable calculus, we studied functions like $y = f(x)$, which are curves on a 2D plane.

    In multivariable calculus, we study functions like $z = f(x, y)$. These are **surfaces** in 3D space.

    Think of $x$ and $y$ as coordinates on a map (Longitude and Latitude), and $z$ as the **altitude** at that location.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## The Paraboloid (The Bowl)

    Let's start with a classic shape: $z = x^2 + y^2$.

    This is called a **Paraboloid**. It looks like a bowl.
    """)
    return


@app.cell
def _(go, np):
    # Create grid of x and y values
    x = np.linspace(-5, 5, 50)
    y = np.linspace(-5, 5, 50)
    X, Y = np.meshgrid(x, y)

    # Calculate Z
    Z = X**2 + Y**2

    # Create surface plot
    fig = go.Figure(data=[go.Surface(z=Z, x=X, y=Y)])

    fig.update_layout(
        title='z = x² + y²',
        autosize=False,
        width=600,
        height=600,
        margin=dict(l=65, r=50, b=65, t=90)
    )

    fig
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Interactive Surface Explorer

    Try changing the parameters $a$ and $b$ in the function:

    $$
    z = a \cdot x^2 + b \cdot y^2
    $$

    ### 🎯 Your Missions:
    1.  **Make a Bowl (Valley):** Set both $a$ and $b$ to positive numbers (e.g., $1.0$). In ML, we want to find the bottom of this bowl (Minimum Error).
    2.  **Make a Hill (Peak):** Set both $a$ and $b$ to negative numbers (e.g., $-1.0$).
    3.  **Make a Saddle:** Set one positive and one negative (e.g., $a=1.0, b=-1.0$). Notice how it goes UP in one direction and DOWN in the other? This is a "Saddle Point" and it's tricky for optimization algorithms!
    """)
    return


@app.cell
def _(mo):
    a_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.1, value=1.0, label="a")
    b_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.1, value=1.0, label="b")

    mo.hstack([a_slider, b_slider], justify="center")
    return a_slider, b_slider


@app.cell
def _(a_slider, b_slider, go, mo, np):
    # Get values
    a = a_slider.value
    b = b_slider.value

    # Create grid
    x_i = np.linspace(-5, 5, 50)
    y_i = np.linspace(-5, 5, 50)
    X_i, Y_i = np.meshgrid(x_i, y_i)

    # Calculate Z based on sliders
    Z_i = a * X_i**2 + b * Y_i**2

    # Create plot
    fig_i = go.Figure(data=[go.Surface(z=Z_i, x=X_i, y=Y_i, colorscale='Viridis')])

    fig_i.update_layout(
        title=f'z = {a:.1f}x² + {b:.1f}y²',
        width=600,
        height=600,
    )

    mo.vstack([
        mo.md(f"**Current Function:** $z = {a:.1f}x^2 + {b:.1f}y^2$"),
        fig_i
    ])
    return X_i, Y_i, Z_i


@app.cell
def _(mo):
    mo.md(r"""
    ### Key Takeaways for Machine Learning

    *   **The Bowl (Convex):** This is the ideal shape for a Loss Function. Gradient Descent will easily roll down to the bottom (Global Minimum).
    *   **The Saddle (Non-Convex):** These are dangerous! A ball might get stuck on the flat part, or roll down the wrong side. Modern Deep Learning deals with millions of saddle points.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Contour Plots (Topographic Maps)

    Sometimes 3D is hard to read. A **Contour Plot** flattens the 3D surface into 2D lines.

    *   Each line represents a constant altitude ($z$).
    *   If lines are close together, the slope is steep.
    *   If lines are far apart, the ground is flat.
    """)
    return


@app.cell
def _(X_i, Y_i, Z_i, go):
    fig_contour = go.Figure(data=[go.Contour(z=Z_i, x=X_i[0], y=Y_i[:,0], colorscale='Viridis')])

    fig_contour.update_layout(
        title='Contour Plot of the Surface Above',
        width=600,
        height=600,
    )

    fig_contour
    return


if __name__ == "__main__":
    app.run()
