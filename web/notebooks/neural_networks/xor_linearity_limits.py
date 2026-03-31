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
        # XOR: Why One Line Fails

        Green points are XOR = 1 and red points are XOR = 0.
        Use the controls to test:

        - A **single perceptron** (one straight boundary)
        - A **2-layer network** (three perceptrons composed)
        """
    )
    return


@app.cell
def _(mo):
    model = mo.ui.radio(
        options=["Single perceptron", "2-layer XOR network"],
        value="Single perceptron",
        label="Model",
    )
    model
    return (model,)


@app.cell
def _(mo):
    w1 = mo.ui.slider(start=-6.0, stop=6.0, step=0.1, value=1.0, label="Single: w1")
    w2 = mo.ui.slider(start=-6.0, stop=6.0, step=0.1, value=1.0, label="Single: w2")
    b = mo.ui.slider(start=-6.0, stop=6.0, step=0.1, value=-0.5, label="Single: b")
    mo.vstack([w1, w2, b], gap=0.3)
    return b, w1, w2


@app.cell
def _(np):
    points = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
    targets = np.array([0, 1, 1, 0], dtype=int)
    return points, targets


@app.cell
def _(np):
    def step(x):
        out = (np.asarray(x) > 0).astype(int)
        if out.shape == ():
            return int(out)
        return out

    def single_predict(x1, x2, w1, w2, b):
        return int((w1 * x1 + w2 * x2 + b) > 0)

    def mlp_predict(x1, x2):
        # Hidden layer: OR and NAND detectors
        h1 = step(1.0 * x1 + 1.0 * x2 - 0.5)   # OR
        h2 = step(-1.0 * x1 + -1.0 * x2 + 1.5) # NAND
        # Output layer: AND over hidden units
        y = step(1.0 * h1 + 1.0 * h2 - 1.5)
        return int(y)

    return mlp_predict, single_predict


@app.cell
def _(b, go, mlp_predict, model, np, points, single_predict, targets, w1, w2):
    xs = np.linspace(-0.4, 1.4, 220)
    ys = np.linspace(-0.4, 1.4, 220)
    xx, yy = np.meshgrid(xs, ys)

    if model.value == "Single perceptron":
        grid_pred = np.vectorize(lambda x1, x2: single_predict(x1, x2, w1.value, w2.value, b.value))(xx, yy)
        point_pred = np.array([single_predict(x1, x2, w1.value, w2.value, b.value) for x1, x2 in points])
        model_caption = rf"$\hat{{y}} = \mathbf{{1}}(w_1x_1 + w_2x_2 + b > 0)$ with $w_1={w1.value:.1f},\ w_2={w2.value:.1f},\ b={b.value:.1f}$"
    else:
        grid_pred = np.vectorize(mlp_predict)(xx, yy)
        point_pred = np.array([mlp_predict(x1, x2) for x1, x2 in points])
        model_caption = r"Fixed 2-layer network: hidden (OR, NAND) $\rightarrow$ output AND"

    misclassified = int(np.sum(point_pred != targets))

    fig = go.Figure()
    fig.add_trace(
        go.Heatmap(
            x=xs,
            y=ys,
            z=grid_pred,
            colorscale=[[0.0, "#7f1d1d"], [0.49, "#7f1d1d"], [0.5, "#14532d"], [1.0, "#14532d"]],
            showscale=False,
            opacity=0.35,
            hoverinfo="skip",
        )
    )

    for (x1, x2), t, p in zip(points, targets, point_pred):
        color = "#22c55e" if t == 1 else "#ef4444"
        symbol = "circle" if p == t else "x"
        fig.add_trace(
            go.Scatter(
                x=[x1],
                y=[x2],
                mode="markers+text",
                text=[f"({int(x1)},{int(x2)})"],
                textposition="top right",
                marker={"size": 14, "color": color, "symbol": symbol, "line": {"color": "white", "width": 1}},
                showlegend=False,
                hovertemplate=f"Target={t}, Pred={p}<extra></extra>",
            )
        )

    if model.value == "Single perceptron":
        x_line = np.linspace(-0.4, 1.4, 200)
        if abs(w2.value) > 1e-8:
            y_line = (-w1.value * x_line - b.value) / w2.value
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
        elif abs(w1.value) > 1e-8:
            x_vertical = -b.value / w1.value
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

    fig.update_layout(
        title="XOR Decision Regions",
        paper_bgcolor="#0b1020",
        plot_bgcolor="#0b1020",
        font={"color": "white"},
        xaxis={
            "title": "x1",
            "range": [-0.5, 1.5],
            "dtick": 0.5,
            "gridcolor": "rgba(255,255,255,0.2)",
            "zeroline": False,
        },
        yaxis={
            "title": "x2",
            "range": [-0.5, 1.5],
            "dtick": 0.5,
            "gridcolor": "rgba(255,255,255,0.2)",
            "zeroline": False,
        },
        margin={"l": 40, "r": 20, "t": 50, "b": 50},
        height=580,
    )

    details = rf"""
    **Model:** {model.value}  
    **Misclassified XOR points:** {misclassified} / 4  
    {model_caption}
    """
    return details, fig, misclassified


@app.cell
def _(details, fig, mo):
    mo.vstack([mo.md(details), mo.ui.plotly(fig)])
    return


if __name__ == "__main__":
    app.run()
