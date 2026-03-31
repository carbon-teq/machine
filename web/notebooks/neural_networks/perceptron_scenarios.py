import marimo

__generated_with = "0.20.4"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import numpy as np

    return mo, np


@app.cell
async def _():
    try:
        import micropip
        _ = await micropip.install("plotly")
    except Exception:
        # Local uv runs can provide plotly via --with plotly.
        _ = None
    return


@app.cell
def _():
    import plotly.graph_objects as go
    return (go,)


@app.cell
def _(mo):
    mo.md(
        r"""
        # Perceptron Scenario Explorer

        We model a festival decision from two factors:
        - $x_1$: weather (`0` rainy, `1` sunny)
        - $x_2$: ticket (`0` expensive, `1` cheap)

        Red points are "Don't go" and green is "Go".
        Move the sliders and see how the line and the selected example change.
        """
    )
    return


@app.cell
def _(mo):
    w1 = mo.ui.slider(start=-5.0, stop=5.0, step=0.1, value=1.0, label="Weight w1 (weather importance)")
    w2 = mo.ui.slider(start=-5.0, stop=5.0, step=0.1, value=1.0, label="Weight w2 (ticket importance)")
    b = mo.ui.slider(start=-5.0, stop=5.0, step=0.1, value=-1.5, label="Bias b (threshold)")
    mo.vstack([w1, w2, b], gap=0.4)
    return b, w1, w2


@app.cell
def _(mo):
    scenario_map = {
        "Rainy + Expensive (0,0)": (0, 0, 0),
        "Rainy + Cheap (0,1)": (0, 1, 0),
        "Sunny + Expensive (1,0)": (1, 0, 0),
        "Sunny + Cheap (1,1)": (1, 1, 1),
    }
    scenario = mo.ui.dropdown(
        options=list(scenario_map.keys()),
        value="Sunny + Cheap (1,1)",
        label="Active lesson example",
        full_width=True,
    )
    scenario
    return scenario, scenario_map


@app.cell
def _(b, go, np, scenario, scenario_map, w1, w2):
    points = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    labels = np.array([0, 0, 0, 1])
    colors = np.where(labels == 1, "green", "red")

    x1_active, x2_active, target_active = scenario_map[scenario.value]
    z_active = w1.value * x1_active + w2.value * x2_active + b.value
    y_hat = 1 if z_active > 0 else 0

    x_line = np.linspace(-0.4, 1.4, 200)
    if abs(w2.value) < 1e-6:
        y_line = None
        x_vertical = -b.value / w1.value if abs(w1.value) > 1e-6 else 0
    else:
        y_line = (-w1.value * x_line - b.value) / w2.value
        x_vertical = None

    fig = go.Figure()

    for (x, y), c in zip(points, colors):
        fig.add_trace(
            go.Scatter(
                x=[x],
                y=[y],
                mode="markers+text",
                text=[f"({x},{y})"],
                textposition="top right",
                marker={"size": 14, "color": c, "line": {"color": "white", "width": 1}},
                showlegend=False,
                hovertemplate="(%{x}, %{y})<extra></extra>",
            )
        )

    if y_line is None:
        fig.add_trace(
            go.Scatter(
                x=[x_vertical, x_vertical],
                y=[-0.5, 1.5],
                mode="lines",
                line={"color": "white", "width": 3},
                showlegend=False,
                hoverinfo="skip",
            )
        )
    else:
        fig.add_trace(
            go.Scatter(
                x=x_line,
                y=y_line,
                mode="lines",
                line={"color": "white", "width": 3},
                showlegend=False,
                hoverinfo="skip",
            )
        )

    fig.add_trace(
        go.Scatter(
            x=[x1_active],
            y=[x2_active],
            mode="markers",
            marker={"size": 28, "color": "rgba(0,0,0,0)", "line": {"color": "gold", "width": 3}},
            showlegend=False,
            hovertemplate="Active: (%{x}, %{y})<extra></extra>",
        )
    )

    fig.update_layout(
        title="Perceptron Decision Boundary",
        paper_bgcolor="#0f172a",
        plot_bgcolor="#0f172a",
        font={"color": "white"},
        xaxis={
            "title": "x1: Weather (0 rainy, 1 sunny)",
            "range": [-0.5, 1.5],
            "dtick": 0.5,
            "gridcolor": "rgba(255,255,255,0.2)",
            "zeroline": False,
        },
        yaxis={
            "title": "x2: Ticket (0 expensive, 1 cheap)",
            "range": [-0.5, 1.5],
            "dtick": 0.5,
            "gridcolor": "rgba(255,255,255,0.2)",
            "zeroline": False,
        },
        margin={"l": 40, "r": 20, "t": 50, "b": 50},
        height=520,
    )

    info = f"""
    **Active example:** $x_1={x1_active},\\ x_2={x2_active}$ (target={target_active})  
    **Score:** $z = w_1x_1 + w_2x_2 + b = {z_active:.2f}$  
    **Perceptron output:** $\\hat{{y}} = {y_hat}$ ({'correct' if y_hat == target_active else 'mismatch'})
    """

    return fig, info, target_active, x1_active, x2_active, y_hat, z_active


@app.cell
def _(fig, info, mo):
    mo.vstack([mo.md(info), mo.ui.plotly(fig)])
    return


if __name__ == "__main__":
    app.run()
