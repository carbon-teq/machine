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
    # Partial Derivatives: Slicing the Mountain

    Imagine you are standing on a mountain in heavy fog.
    You know your exact location, but the only question that matters is:
    **"Which way gets me uphill fastest?"**

    In single-variable calculus, there was only one path, so one derivative was enough.
    Here, the ground is a surface $z = f(x, y)$, so you can move in many directions.
    That means "the slope" is no longer one number by default.

    Partial derivatives solve this by asking focused questions:
    * If we move only East/West (change $x$, keep $y$ fixed), what slope do we feel?
    * If we move only North/South (change $y$, keep $x$ fixed), what slope do we feel?

    We answer those questions by taking clean **slices** of the surface and measuring tangent-line slopes on each slice.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Build Intuition First

    Think of the surface as a landscape:
    * **$x$-direction slice:** freeze $y$, walk left/right, and read the slope on that cross-section.
    * **$y$-direction slice:** freeze $x$, walk forward/backward, and read the slope on that cross-section.

    Now we write this formally:
    * $\frac{\partial f}{\partial x}$: slope along the $x$ direction while $y$ is fixed.
    * $\frac{\partial f}{\partial y}$: slope along the $y$ direction while $x$ is fixed.

    **Symbol Dictionary**
    * $x, y$: horizontal coordinates (your map position)
    * $z = f(x, y)$: altitude at that position
    * $\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}$: directional slopes along coordinate axes

    Let's apply this to a surface where both directions behave differently:
    $$
    f(x, y) = x^2 - y^2
    $$

    This is a **saddle**: moving in one direction bends upward, while moving in the other bends downward.

    > [!TIP]
    > **ML Relevance:** In optimization, this is exactly why training is hard in high dimensions.
    > The model can improve in one direction and get worse in another at the same point.
    """)
    return


@app.cell
def _(go, np):
    # Create grid
    x = np.linspace(-2, 2, 50)
    y = np.linspace(-2, 2, 50)
    X, Y = np.meshgrid(x, y)
    Z = X**2 - Y**2

    surface = go.Surface(z=Z, x=X, y=Y, opacity=0.8, name='Surface', showscale=False)

    layout = go.Layout(
        title='f(x, y) = x² - y²',
        width=600,
        height=600,
        scene=dict(
            xaxis_title='X',
            yaxis_title='Y',
            zaxis_title='Z'
        )
    )

    go.Figure(data=[surface], layout=layout)
    return X, Y, Z


@app.cell
def _(mo):
    mo.md(r"""
    ## Slicing with respect to X

    To find $\frac{\partial f}{\partial x}$, we treat $y$ as a constant.

    1.  **Slice:** Fix $y$ (choose a slice with the first slider).
    2.  **Tangent:** Pick a point $x$ on that slice (second slider).
    3.  **Slope:** The slope of the red tangent line is the partial derivative $\frac{\partial f}{\partial x} = 2x$.
    """)
    return


@app.cell
def _(mo):
    y_slice_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.5, value=0.0, label="1. Slice at y=")
    x_point_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.25, value=1.0, label="2. Tangent at x=")

    mo.hstack([y_slice_slider, x_point_slider], justify="center")
    return x_point_slider, y_slice_slider


@app.cell
def _(X, Y, Z, go, mo, np, x_point_slider, y_slice_slider):
    y_val = y_slice_slider.value
    x_pt = x_point_slider.value

    # 1. The Surface
    surface_plot = go.Surface(z=Z, x=X, y=Y, opacity=0.3, showscale=False, colorscale='Blues')

    # 2. The Slicing Plane (y = y_val)
    z_plane = np.linspace(np.min(Z), np.max(Z), 2)
    x_plane = np.linspace(np.min(X), np.max(X), 2)
    X_plane, Z_plane = np.meshgrid(x_plane, z_plane)
    Y_plane = np.full_like(X_plane, y_val)

    plane_plot = go.Surface(
        x=X_plane, y=Y_plane, z=Z_plane, 
        opacity=0.2, showscale=False, colorscale='Reds', name='Slice Plane'
    )

    # 3. The Intersection Curve (z = x^2 - y_val^2)
    x_curve = np.linspace(-2, 2, 100)
    y_curve = np.full_like(x_curve, y_val)
    z_curve = x_curve**2 - y_val**2

    curve_plot = go.Scatter3d(
        x=x_curve, y=y_curve, z=z_curve,
        mode='lines', line=dict(color='red', width=5), name='Intersection Curve'
    )

    # 4. Tangent Line at x_pt
    # z = f(x, y_val) = x^2 - y_val^2
    # Slope m = df/dx = 2x
    slope = 2 * x_pt
    z_pt = x_pt**2 - y_val**2

    # Line equation: z - z_pt = slope * (x - x_pt)
    # z = slope * (x - x_pt) + z_pt
    x_tan = np.linspace(x_pt - 1, x_pt + 1, 10)
    y_tan = np.full_like(x_tan, y_val)
    z_tan = slope * (x_tan - x_pt) + z_pt

    tangent_plot = go.Scatter3d(
        x=x_tan, y=y_tan, z=z_tan,
        mode='lines', line=dict(color='black', width=6, dash='solid'), name='Tangent Line'
    )

    # Point marker
    point_plot = go.Scatter3d(
        x=[x_pt], y=[y_val], z=[z_pt],
        mode='markers', marker=dict(color='black', size=8), name='Point'
    )

    fig = go.Figure(data=[surface_plot, plane_plot, curve_plot, tangent_plot, point_plot])
    fig.update_layout(
        title=f'∂f/∂x = {slope:.2f} at x={x_pt}, y={y_val}',
        width=700,
        height=700,
        scene=dict(
            aspectmode='cube',
            xaxis=dict(range=[-2, 2]),
            yaxis=dict(range=[-2, 2]),
            zaxis=dict(range=[-4, 4])
        )
    )

    mo.vstack([
        mo.md(rf"**Partial Derivative $\partial f / \partial x$**"),
        mo.md(f"At $x={x_pt}$, the slope is $2({x_pt}) = {slope:.2f}$."),
        fig
    ])
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Slicing with respect to Y

    Now let's find $\frac{\partial f}{\partial y}$. We treat $x$ as a constant.

    1.  **Slice:** Fix $x$ (choose a slice with the first slider).
    2.  **Tangent:** Pick a point $y$ on that slice (second slider).
    3.  **Slope:** The slope of the green tangent line is the partial derivative $\frac{\partial f}{\partial y} = -2y$.
    """)
    return


@app.cell
def _(mo):
    x_slice_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.5, value=0.0, label="1. Slice at x=")
    y_point_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.25, value=1.0, label="2. Tangent at y=")

    mo.hstack([x_slice_slider, y_point_slider], justify="center")
    return x_slice_slider, y_point_slider


@app.cell
def _(X, Y, Z, go, mo, np, x_slice_slider, y_point_slider):
    x_val = x_slice_slider.value
    y_pt = y_point_slider.value

    # 1. The Surface
    surface_plot_y = go.Surface(z=Z, x=X, y=Y, opacity=0.3, showscale=False, colorscale='Blues')

    # 2. The Slicing Plane (x = x_val)
    z_plane_y = np.linspace(np.min(Z), np.max(Z), 2)
    y_plane_y = np.linspace(np.min(Y), np.max(Y), 2)
    Y_plane_y, Z_plane_y = np.meshgrid(y_plane_y, z_plane_y)
    X_plane_y = np.full_like(Y_plane_y, x_val)

    plane_plot_y = go.Surface(
        x=X_plane_y, y=Y_plane_y, z=Z_plane_y, 
        opacity=0.2, showscale=False, colorscale='Greens', name='Slice Plane'
    )

    # 3. The Intersection Curve (z = x_val^2 - y^2)
    y_curve_y = np.linspace(-2, 2, 100)
    x_curve_y = np.full_like(y_curve_y, x_val)
    z_curve_y = x_val**2 - y_curve_y**2

    curve_plot_y = go.Scatter3d(
        x=x_curve_y, y=y_curve_y, z=z_curve_y,
        mode='lines', line=dict(color='green', width=5), name='Intersection Curve'
    )

    # 4. Tangent Line at y_pt
    # z = f(x_val, y) = x_val^2 - y^2
    # Slope m = df/dy = -2y
    slope_y = -2 * y_pt
    z_pt_y = x_val**2 - y_pt**2

    # Line equation: z - z_pt = slope * (y - y_pt)
    y_tan_y = np.linspace(y_pt - 1, y_pt + 1, 10)
    x_tan_y = np.full_like(y_tan_y, x_val)
    z_tan_y = slope_y * (y_tan_y - y_pt) + z_pt_y

    tangent_plot_y = go.Scatter3d(
        x=x_tan_y, y=y_tan_y, z=z_tan_y,
        mode='lines', line=dict(color='black', width=6, dash='solid'), name='Tangent Line'
    )

    # Point marker
    point_plot_y = go.Scatter3d(
        x=[x_val], y=[y_pt], z=[z_pt_y],
        mode='markers', marker=dict(color='black', size=8), name='Point'
    )

    fig_y = go.Figure(data=[surface_plot_y, plane_plot_y, curve_plot_y, tangent_plot_y, point_plot_y])
    fig_y.update_layout(
        title=f'∂f/∂y = {slope_y:.2f} at x={x_val}, y={y_pt}',
        width=700,
        height=700,
        scene=dict(
            aspectmode='cube',
            xaxis=dict(range=[-2, 2]),
            yaxis=dict(range=[-2, 2]),
            zaxis=dict(range=[-4, 4])
        )
    )

    mo.vstack([
        mo.md(rf"**Partial Derivative $\partial f / \partial y$**"),
        mo.md(f"At $y={y_pt}$, the slope is $-2({y_pt}) = {slope_y:.2f}$."),
        fig_y
    ])
    return


if __name__ == "__main__":
    app.run()
