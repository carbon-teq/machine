import marimo

__generated_with = "0.20.4"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import numpy as np
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots

    return go, make_subplots, mo, np


@app.cell
def _(mo):
    mo.md(
        r"""
    # Training Execution Loop Explorer

    Tune dataset size, batch size, and epochs to see how training unfolds:

    - how many iterations happen in each epoch
    - how the average batch loss changes over epochs
    - how gradient magnitudes evolve during updates
    """
    )
    return


@app.cell
def _(mo):
    dataset_size = mo.ui.slider(
        start=64,
        stop=4096,
        step=64,
        value=1024,
        label="Dataset size",
    )
    batch_size = mo.ui.slider(
        start=8,
        stop=256,
        step=8,
        value=32,
        label="Batch size",
    )
    epochs = mo.ui.slider(
        start=5,
        stop=120,
        step=5,
        value=40,
        label="Epochs",
    )
    learning_rate = mo.ui.slider(
        start=0.005,
        stop=0.3,
        step=0.005,
        value=0.08,
        label="Learning rate",
    )
    mo.vstack([dataset_size, batch_size, epochs, learning_rate], gap=0.4)
    return batch_size, dataset_size, epochs, learning_rate


@app.cell
def _(batch_size, dataset_size, epochs, learning_rate, mo, np):
    rng = np.random.default_rng(7)

    n_samples = int(dataset_size.value)
    bs = int(batch_size.value)
    num_epochs = int(epochs.value)
    lr = float(learning_rate.value)
    iterations_per_epoch = n_samples // bs

    x = rng.normal(0.0, 1.0, size=(n_samples, 2))
    true_w = np.array([[2.0], [-1.6]])
    true_b = 0.35
    logits_true = x @ true_w + true_b
    probs = 1.0 / (1.0 + np.exp(-logits_true))
    y = (rng.random((n_samples, 1)) < probs).astype(float)

    w = np.zeros((2, 1))
    b = 0.0

    epoch_losses = []
    grad_norms = []

    for _epoch in range(num_epochs):
        perm = rng.permutation(n_samples)
        x_epoch = x[perm]
        y_epoch = y[perm]
        running_loss = 0.0
        running_grad_norm = 0.0

        for i in range(iterations_per_epoch):
            start = i * bs
            end = start + bs
            xb = x_epoch[start:end]
            yb = y_epoch[start:end]

            logits = xb @ w + b
            preds = 1.0 / (1.0 + np.exp(-logits))
            eps = 1e-7
            loss = -np.mean(
                yb * np.log(preds + eps) + (1.0 - yb) * np.log(1.0 - preds + eps)
            )

            grad_logits = (preds - yb) / bs
            grad_w = xb.T @ grad_logits
            grad_b = float(np.sum(grad_logits))
            grad_norm = float(np.sqrt(np.sum(grad_w**2) + grad_b**2))

            w = w - lr * grad_w
            b = b - lr * grad_b

            running_loss += float(loss)
            running_grad_norm += grad_norm

        epoch_losses.append(running_loss / iterations_per_epoch)
        grad_norms.append(running_grad_norm / iterations_per_epoch)

    total_updates = num_epochs * iterations_per_epoch
    effective_examples = total_updates * bs
    summary_md = mo.md(
        f"""
**Iterations per epoch:** `{iterations_per_epoch}`  
**Total updates:** `{total_updates}`  
**Examples seen across all updates:** `{effective_examples}`  
**Final average epoch loss:** `{epoch_losses[-1]:.4f}`  
**Final average gradient norm:** `{grad_norms[-1]:.4f}`
"""
    )
    return grad_norms, iterations_per_epoch, num_epochs, summary_md, total_updates, epoch_losses


@app.cell
def _(epoch_losses, go, grad_norms, make_subplots, num_epochs):
    epochs_axis = list(range(1, num_epochs + 1))
    
    fig = make_subplots(rows=1, cols=2, subplot_titles=("Average Loss per Epoch", "Average Gradient Norm per Epoch"))
    
    fig.add_trace(
        go.Scatter(x=epochs_axis, y=epoch_losses, mode='lines', line=dict(color='#22c55e', width=2.2), name='Loss'),
        row=1, col=1
    )
    
    fig.add_trace(
        go.Scatter(x=epochs_axis, y=grad_norms, mode='lines', line=dict(color='#f97316', width=2.2), name='Gradient Norm'),
        row=1, col=2
    )
    
    fig.update_layout(
        height=420,
        showlegend=False,
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(l=20, r=20, t=40, b=20)
    )
    
    fig.update_xaxes(title_text="Epoch", showgrid=True, gridwidth=1, gridcolor='rgba(0,0,0,0.1)', row=1, col=1)
    fig.update_yaxes(title_text="Loss", showgrid=True, gridwidth=1, gridcolor='rgba(0,0,0,0.1)', row=1, col=1)
    
    fig.update_xaxes(title_text="Epoch", showgrid=True, gridwidth=1, gridcolor='rgba(0,0,0,0.1)', row=1, col=2)
    fig.update_yaxes(title_text="Gradient Norm", showgrid=True, gridwidth=1, gridcolor='rgba(0,0,0,0.1)', row=1, col=2)
    
    return fig,


@app.cell
def _(fig, mo, summary_md):
    mo.vstack([summary_md, mo.ui.plotly(fig)])
    return


if __name__ == "__main__":
    app.run()
