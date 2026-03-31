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
    mo.md(
        r"""
        # Gradient & Jacobian Explorer

        ## Part 1: The Gradient (Scalar Field)
        We are exploring the surface $z = x^2 + y^2$.
        
        *   **The Surface:** The blue bowl shape.
        *   **The Red Arrow:** The Gradient $\nabla f$. It lives in the input space (on the floor).
        *   **Key Insight:** Notice that the arrow points in the direction where the bowl goes up steepest.
        """
    )
    return


@app.cell
def _(mo):
    x_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.25, value=1.0, label="x position")
    y_slider = mo.ui.slider(start=-2.0, stop=2.0, step=0.25, value=1.0, label="y position")
    mo.hstack([x_slider, y_slider], justify="center")
    return x_slider, y_slider


@app.cell
def _(go, mo, np, x_slider, y_slider):
    # 1. Setup Data
    x0 = x_slider.value
    y0 = y_slider.value
    
    # Grid for surface
    x_range = np.linspace(-2.5, 2.5, 50)
    y_range = np.linspace(-2.5, 2.5, 50)
    X, Y = np.meshgrid(x_range, y_range)
    Z = X**2 + Y**2

    # Gradient Calculation
    # f(x,y) = x^2 + y^2  =>  grad = [2x, 2y]
    gx = 2 * x0
    gy = 2 * y0
    z0 = x0**2 + y0**2

    # 2. Create Plot Elements
    
    # The Surface
    surface = go.Surface(
        x=X, y=Y, z=Z,
        colorscale="Viridis",
        opacity=0.8,
        showscale=False,
        contours_z=dict(show=True, usecolormap=False, project_z=True, color="white"),
        lighting=dict(ambient=0.6, roughness=0.9, diffuse=0.5, fresnel=0.2)
    )

    # The Point on Surface
    point_on_surface = go.Scatter3d(
        x=[x0], y=[y0], z=[z0],
        mode='markers',
        marker=dict(size=6, color='black'),
        name='Your Position'
    )

    # The Gradient Arrow (Projected on Floor at z=0 for visibility)
    # We draw it as a Cone
    grad_cone = go.Cone(
        x=[x0], y=[y0], z=[0], # Base of arrow
        u=[gx], v=[gy], w=[0], # Direction
        sizemode="scaled",
        sizeref=0.5,           # Tuned size
        anchor="tail",
        colorscale=[[0, 'red'], [1, 'red']],
        showscale=False,
        name='Gradient'
    )
    
    # Dashed line connecting floor to surface
    connector_line = go.Scatter3d(
        x=[x0, x0], y=[y0, y0], z=[0, z0],
        mode='lines',
        line=dict(color='black', width=2, dash='dash'),
        showlegend=False
    )

    # 3. Layout Aesthetics
    fig = go.Figure(data=[surface, point_on_surface, grad_cone, connector_line])
    
    fig.update_layout(
        title=f"Gradient at ({x0:.1f}, {y0:.1f}) points towards [{gx:.1f}, {gy:.1f}]",
        width=700, height=600,
        scene=dict(
            xaxis_title="x", yaxis_title="y", zaxis_title="z",
            aspectmode='cube', # Keeps units 1:1:1 so steepness is real
            camera=dict(eye=dict(x=1.5, y=1.5, z=1.2))
        ),
        margin=dict(l=0, r=0, b=0, t=40)
    )

    mo.vstack([
        mo.md(f"**Gradient Vector:** $[{gx:.2f}, {gy:.2f}]$"),
        fig
    ])
    return connector_line, fig, grad_cone, gx, gy, point_on_surface, surface, X, Y, Z, x0, x_range, y0, y_range, z0


@app.cell
def _(mo):
    mo.md(
        r"""
        ## Part 2: The Jacobian (Vector Field)
        Now consider a vector field $\mathbf{F}(x, y) = [x^2 - y, \ x + y^2]^T$.
        
        The **Jacobian Matrix** columns tell us how the vector field changes if we nudge $x$ or $y$.
        *   **Blue Arrow:** The vector field value $\mathbf{F}(x,y)$.
        *   **Magenta Arrow:** Column 1 of Jacobian (Sensitivity to $x$).
        *   **Cyan Arrow:** Column 2 of Jacobian (Sensitivity to $y$).
        """
    )
    return


@app.cell
def _(go, mo, np, x_slider, y_slider):
    # 1. Setup Data
    x0_vf = x_slider.value
    y0_vf = y_slider.value

    # Vector Field Definition
    # F = [x^2 - y, x + y^2]
    u0 = x0_vf**2 - y0_vf
    v0 = x0_vf + y0_vf**2
    
    # Jacobian Definition
    # J = [[2x, -1], [1, 2y]]
    j_col1 = [2*x0_vf, 1]      # Partial F / Partial x
    j_col2 = [-1, 2*y0_vf]     # Partial F / Partial y

    # 2. Plot Elements
    
    # Background Vector Field (faded) - Manual construction of lines
    x_grid = np.linspace(-2, 2, 10)
    y_grid = np.linspace(-2, 2, 10)
    Xg, Yg = np.meshgrid(x_grid, y_grid)
    Ug = Xg**2 - Yg
    Vg = Xg + Yg**2
    # Normalize for display
    mag = np.sqrt(Ug**2 + Vg**2)
    Ug_n = Ug / (mag + 1e-9)
    Vg_n = Vg / (mag + 1e-9)
    
    # Create line segments for background field
    scale = 0.2
    x_starts = Xg.flatten()
    y_starts = Yg.flatten()
    u_vecs = Ug_n.flatten() * scale
    v_vecs = Vg_n.flatten() * scale
    
    x_lines = np.empty(3 * len(x_starts))
    x_lines[:] = np.nan
    x_lines[0::3] = x_starts
    x_lines[1::3] = x_starts + u_vecs
    
    y_lines = np.empty(3 * len(y_starts))
    y_lines[:] = np.nan
    y_lines[0::3] = y_starts
    y_lines[1::3] = y_starts + v_vecs

    field_plot = go.Scatter(
        x=x_lines,
        y=y_lines,
        mode='lines',
        line=dict(color='lightgray', width=1),
        name='Background Field',
        hoverinfo='skip'
    )

    # Main Vector F at point
    # We use annotations for the main arrows to ensure they look like arrows
    
    layout_annotations = []
    
    # F(x,y) Arrow
    layout_annotations.append(dict(
        x=x0_vf + u0*0.2, y=y0_vf + v0*0.2,
        ax=x0_vf, ay=y0_vf,
        xref='x', yref='y', axref='x', ayref='y',
        showarrow=True, arrowhead=2, arrowsize=1, arrowwidth=3, arrowcolor='blue'
    ))
    
    # Jacobian Col 1 Arrow
    layout_annotations.append(dict(
        x=x0_vf + j_col1[0]*0.2, y=y0_vf + j_col1[1]*0.2,
        ax=x0_vf, ay=y0_vf,
        xref='x', yref='y', axref='x', ayref='y',
        showarrow=True, arrowhead=2, arrowsize=1, arrowwidth=2, arrowcolor='magenta'
    ))
    
    # Jacobian Col 2 Arrow
    layout_annotations.append(dict(
        x=x0_vf + j_col2[0]*0.2, y=y0_vf + j_col2[1]*0.2,
        ax=x0_vf, ay=y0_vf,
        xref='x', yref='y', axref='x', ayref='y',
        showarrow=True, arrowhead=2, arrowsize=1, arrowwidth=2, arrowcolor='cyan'
    ))

    # Dummy traces for legend
    main_vec_dummy = go.Scatter(x=[None], y=[None], mode='lines', line=dict(color='blue', width=3), name='F(x,y)')
    jac_x_dummy = go.Scatter(x=[None], y=[None], mode='lines', line=dict(color='magenta', width=2), name='dF/dx (Col 1)')
    jac_y_dummy = go.Scatter(x=[None], y=[None], mode='lines', line=dict(color='cyan', width=2), name='dF/dy (Col 2)')

    # 3. Layout
    fig2 = go.Figure(data=[field_plot, main_vec_dummy, jac_x_dummy, jac_y_dummy])
    fig2.update_layout(
        title="Jacobian Sensitivity Analysis",
        width=700, height=600,
        xaxis=dict(range=[-3, 3], title="x"),
        yaxis=dict(range=[-3, 3], title="y", scaleanchor="x"),
        showlegend=True,
        annotations=layout_annotations
    )

    mo.vstack([
        mo.md(f"""
        **Jacobian Matrix:**
        $$
        J = \\begin{{bmatrix}} {j_col1[0]:.2f} & {j_col2[0]:.2f} \\\\ {j_col1[1]:.2f} & {j_col2[1]:.2f} \\end{{bmatrix}}
        $$
        """),
        fig2
    ])
    return (
        Xg,
        Yg,
        field_plot,
        fig2,
        j_col1,
        j_col2,
        jac_x_dummy,
        jac_y_dummy,
        layout_annotations,
        mag,
        main_vec_dummy,
        scale,
        u0,
        u_vecs,
        v0,
        v_vecs,
        x0_vf,
        x_ends,
        x_grid,
        x_lines,
        x_starts,
        y0_vf,
        y_ends,
        y_grid,
        y_lines,
        y_starts,
    )


if __name__ == "__main__":
    app.run()
