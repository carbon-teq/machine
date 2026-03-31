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
    from plotly.subplots import make_subplots

    return go, make_subplots


@app.cell
def _(mo):
    mo.md(r"""
    # From Models to a Landscape

    The dataset stays fixed. Only the parameters move.

    Use the sliders to change the line $\hat{y} = wx + b$.
    On the left, you see the model fitting the data.
    On the right, you see where that same choice of $(w, b)$ lands on the loss landscape.
    """)
    return


@app.cell
def _(mo):
    w_slider = mo.ui.slider(
        start=-1.0,
        stop=5.0,
        step=0.1,
        value=1.4,
        label="Weight w (slope)",
    )
    b_slider = mo.ui.slider(
        start=-2.0,
        stop=8.0,
        step=0.1,
        value=0.8,
        label="Bias b (intercept)",
    )
    mo.vstack([w_slider, b_slider], gap=0.4)
    return b_slider, w_slider


@app.cell
def _(np):
    x_data = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
    y_data = np.array([3.2, 5.1, 7.4, 8.3, 11.0])
    return x_data, y_data


@app.cell
def _(b_slider, np, w_slider, x_data, y_data):
    w_value = w_slider.value
    b_value = b_slider.value

    y_hat = w_value * x_data + b_value
    residuals = y_data - y_hat
    mse = np.mean(residuals**2)

    w_grid = np.linspace(-1.0, 5.0, 120)
    b_grid = np.linspace(-2.0, 8.0, 120)
    W, B = np.meshgrid(w_grid, b_grid)
    loss_grid = np.zeros_like(W)

    for index in range(len(x_data)):
        y_hat_grid = W * x_data[index] + B
        loss_grid += (y_data[index] - y_hat_grid) ** 2

    loss_grid = loss_grid / len(x_data)
    return B, W, b_value, loss_grid, mse, residuals, w_value, y_hat


@app.cell
def _(
    B,
    W,
    b_value,
    go,
    loss_grid,
    make_subplots,
    mse,
    residuals,
    w_value,
    x_data,
    y_data,
    y_hat,
):
    figure = make_subplots(
        rows=1,
        cols=2,
        subplot_titles=("One Parameter Setting = One Line", "The Same Setting on the Loss Landscape"),
        horizontal_spacing=0.12,
    )

    figure.add_trace(
        go.Scatter(
            x=x_data,
            y=y_data,
            mode="markers",
            name="Data",
            marker={"size": 10, "color": "#22c55e"},
        ),
        row=1,
        col=1,
    )

    figure.add_trace(
        go.Scatter(
            x=x_data,
            y=y_hat,
            mode="lines",
            name="Model line",
            line={"width": 3, "color": "#f97316"},
        ),
        row=1,
        col=1,
    )

    for x_value, y_true, y_pred in zip(x_data, y_data, y_hat):
        figure.add_trace(
            go.Scatter(
                x=[x_value, x_value],
                y=[y_true, y_pred],
                mode="lines",
                showlegend=False,
                line={"width": 2, "color": "rgba(148, 163, 184, 0.9)", "dash": "dot"},
                hoverinfo="skip",
            ),
            row=1,
            col=1,
        )

    figure.add_trace(
        go.Contour(
            x=W[0],
            y=B[:, 0],
            z=loss_grid,
            colorscale="Viridis",
            contours={"showlabels": True},
            colorbar={"title": "MSE", "x": 1.02},
            name="Loss",
        ),
        row=1,
        col=2,
    )

    figure.add_trace(
        go.Scatter(
            x=[w_value],
            y=[b_value],
            mode="markers",
            name="Current $(w,b)$",
            marker={"size": 12, "color": "#ef4444", "line": {"color": "white", "width": 1}},
        ),
        row=1,
        col=2,
    )

    figure.update_xaxes(title_text="x", row=1, col=1)
    figure.update_yaxes(title_text="y", row=1, col=1)
    figure.update_xaxes(title_text="w", row=1, col=2)
    figure.update_yaxes(title_text="b", row=1, col=2)

    figure.update_layout(
        height=520,
        paper_bgcolor="#0f172a",
        plot_bgcolor="#0f172a",
        font={"color": "white"},
        margin={"l": 40, "r": 70, "t": 60, "b": 40},
        legend={"orientation": "h", "y": 1.12},
    )

    residual_text = ", ".join(f"{value:.2f}" for value in residuals)
    summary = f"""
    **Current model:** $\\hat{{y}} = {w_value:.2f}x + {b_value:.2f}$  
    **Mean squared error:** ${mse:.3f}$  
    **Residuals:** ${residual_text}$
    """
    return figure, summary


@app.cell
def _(figure, mo, summary):
    mo.vstack([mo.md(summary), mo.ui.plotly(figure)])
    return


if __name__ == "__main__":
    app.run()
