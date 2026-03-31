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
        # Divergence & Curl Explorer

        **The Jacobian Matrix** contains all the information about how a vector field changes.
        But sometimes we want to summarize that information into single numbers.

        *   **Divergence:** Sum of the diagonal elements (Trace). Measures expansion.
        *   **Curl:** Difference of off-diagonal elements. Measures rotation.
        """
    )
    return


@app.cell
def _(mo):
    field_type = mo.ui.dropdown(
        options={
            "source": "Source (High Divergence)",
            "sink": "Sink (Negative Divergence)",
            "vortex": "Vortex (High Curl)",
            "saddle": "Saddle (Zero Div, Zero Curl)",
            "shear": "Shear (Curl but no Rotation?)",
        },
        value="source",
        label="Select Vector Field"
    )
    mo.vstack([field_type])
    return field_type


@app.cell
def _(field_type, go, mo, np):
    # 1. Define Fields
    def get_field(ftype, x, y):
        if ftype == "source":
            # F = [x, y] -> Div = 1+1=2, Curl = 0-0=0
            u = x
            v = y
            title = "Source: F = [x, y]"
            desc = "Divergence > 0 (Expanding), Curl = 0"
        elif ftype == "sink":
            # F = [-x, -y] -> Div = -2, Curl = 0
            u = -x
            v = -y
            title = "Sink: F = [-x, -y]"
            desc = "Divergence < 0 (Compressing), Curl = 0"
        elif ftype == "vortex":
            # F = [-y, x] -> Div = 0, Curl = 1 - (-1) = 2
            u = -y
            v = x
            title = "Vortex: F = [-y, x]"
            desc = "Divergence = 0, Curl > 0 (CCW Rotation)"
        elif ftype == "saddle":
            # F = [x, -y] -> Div = 1-1=0, Curl = 0
            u = x
            v = -y
            title = "Saddle: F = [x, -y]"
            desc = "Divergence = 0, Curl = 0"
        elif ftype == "shear":
            # F = [y, 0] -> Div = 0, Curl = -1
            u = y
            v = np.zeros_like(x)
            title = "Shear: F = [y, 0]"
            desc = "Divergence = 0, Curl < 0 (CW Rotation)"
        else:
            u, v = x, y
            title, desc = "", ""
        return u, v, title, desc

    # 2. Generate Grid
    x_range = np.linspace(-2, 2, 15)
    y_range = np.linspace(-2, 2, 15)
    X, Y = np.meshgrid(x_range, y_range)
    
    U, V, title_str, desc_str = get_field(field_type.value, X, Y)

    # 3. Plot - Manual Quiver Construction
    scale = 0.15
    
    # Normalize for display consistency
    mag = np.sqrt(U**2 + V**2)
    max_mag = np.max(mag) if np.max(mag) > 0 else 1.0
    
    # Draw simple lines for the field
    # We will use a Scatter plot with None to break lines
    x_lines = []
    y_lines = []
    
    for i in range(X.shape[0]):
        for j in range(X.shape[1]):
            x0, y0 = X[i, j], Y[i, j]
            u0, v0 = U[i, j], V[i, j]
            
            # Scale arrow
            x1 = x0 + u0 * scale
            y1 = y0 + v0 * scale
            
            x_lines.extend([x0, x1, None])
            y_lines.extend([y0, y1, None])
            
            # Add arrow head (rudimentary)
            # angle = np.arctan2(v0, u0)
            # mag_arrow = np.sqrt(u0**2 + v0**2) * scale * 0.3
            # x_lines.extend([x1, x1 - mag_arrow * np.cos(angle - 0.5), None])
            # y_lines.extend([y1, y1 - mag_arrow * np.sin(angle - 0.5), None])
            # x_lines.extend([x1, x1 - mag_arrow * np.cos(angle + 0.5), None])
            # y_lines.extend([y1, y1 - mag_arrow * np.sin(angle + 0.5), None])


    fig = go.Figure()

    # Vector Field Lines
    fig.add_trace(go.Scatter(
        x=x_lines,
        y=y_lines,
        mode='lines',
        line=dict(width=1.5, color='teal'),
        name='Vector Field',
        hoverinfo='skip'
    ))
    
    # Add Arrowheads using markers (cleaner than drawing lines)
    # We place a marker at the tip of each vector
    tip_x = (X + U * scale).flatten()
    tip_y = (Y + V * scale).flatten()
    
    # Calculate angle for marker rotation
    # Plotly markers don't rotate easily in 2D scatter without custom SVG paths or using annotations
    # So we will use 'triangle-up' and rotate? No, scatter marker rotation is limited.
    # We will stick to lines or use annotations for a few key arrows if needed.
    # Actually, let's use Cone for 3D? No, this is 2D.
    # Let's use annotations for a subset of arrows to show direction clearly?
    # Or just use the lines - usually sufficient for "flow".
    # Let's add a few explicit arrows using annotations
    
    step = 3 # Only draw arrowheads for every 3rd point to avoid clutter
    annotations = []
    for i in range(0, X.shape[0], step):
        for j in range(0, X.shape[1], step):
             x0, y0 = X[i, j], Y[i, j]
             u0, v0 = U[i, j], V[i, j]
             annotations.append(dict(
                x=x0 + u0 * scale, y=y0 + v0 * scale,
                ax=x0, ay=y0,
                xref='x', yref='y', axref='x', ayref='y',
                showarrow=True, arrowhead=2, arrowsize=1, arrowwidth=1, arrowcolor='teal'
             ))
    
    fig.update_layout(annotations=annotations)

    # Add a "Test Particle" circle to visualize deformation
    fig.add_trace(go.Scatter(
        x=[0], y=[0],
        mode='markers',
        marker=dict(size=10, color='red'),
        name='Center'
    ))

    fig.update_layout(
        title=f"{title_str}<br><sub>{desc_str}</sub>",
        width=700, height=600,
        xaxis=dict(range=[-2.5, 2.5], title="x", scaleanchor="y"),
        yaxis=dict(range=[-2.5, 2.5], title="y"),
        showlegend=False
    )

    # 4. Jacobian Calculation Display
    if field_type.value == "source":
        j_tex = r"\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}"
        div_calc = "1 + 1 = 2"
        curl_calc = "0 - 0 = 0"
    elif field_type.value == "sink":
        j_tex = r"\begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix}"
        div_calc = "-1 + (-1) = -2"
        curl_calc = "0 - 0 = 0"
    elif field_type.value == "vortex":
        j_tex = r"\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}"
        div_calc = "0 + 0 = 0"
        curl_calc = "1 - (-1) = 2"
    elif field_type.value == "saddle":
        j_tex = r"\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}"
        div_calc = "1 + (-1) = 0"
        curl_calc = "0 - 0 = 0"
    elif field_type.value == "shear":
        j_tex = r"\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}"
        div_calc = "0 + 0 = 0"
        curl_calc = "0 - 1 = -1"
    else:
        j_tex = ""
        div_calc = ""
        curl_calc = ""

    mo.vstack([
        mo.md(f"""
        ### The Connection to Jacobian
        For this field, the Jacobian matrix is constant:
        $$
        J = {j_tex} = \\begin{{bmatrix}} \\partial_x F_x & \\partial_y F_x \\\\ \\partial_x F_y & \\partial_y F_y \\end{{bmatrix}}
        $$

        *   **Divergence (Trace):** Sum of diagonal diagonals.  
            $\\nabla \\cdot \\mathbf{{F}} = {div_calc}$
        *   **Curl (Skew):** Off-diagonal difference ($J_{{21}} - J_{{12}}$).  
            $\\nabla \\times \\mathbf{{F}} = {curl_calc}$
        """),
        fig
    ])
    return (
        U,
        V,
        X,
        Y,
        annotations,
        curl_calc,
        desc_str,
        div_calc,
        fig,
        get_field,
        i,
        j,
        j_tex,
        mag,
        max_mag,
        scale,
        step,
        tip_x,
        tip_y,
        title_str,
        u0,
        v0,
        x0,
        x1,
        x_lines,
        x_range,
        y0,
        y1,
        y_lines,
        y_range,
    )


if __name__ == "__main__":
    app.run()
