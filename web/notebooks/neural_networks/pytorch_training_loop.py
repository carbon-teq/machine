import marimo

__generated_with = "0.20.4"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from torch.utils.data import DataLoader, TensorDataset
    import plotly.graph_objects as go
    from sklearn.datasets import make_moons
    from sklearn.model_selection import train_test_split

    return (
        DataLoader,
        TensorDataset,
        go,
        make_moons,
        mo,
        nn,
        optim,
        torch,
        train_test_split,
    )


@app.cell
def _(mo):
    mo.md("""
    ### 1. Building the Machinery

    First, we define our dataset, model, loss function, and optimizer.

    Instead of a tiny toy dataset, let's use a non-linear "moons" dataset that actually requires a neural network to solve.
    """)
    return


@app.cell
def _(
    DataLoader,
    TensorDataset,
    make_moons,
    nn,
    optim,
    torch,
    train_test_split,
):
    # Generate 1000 samples of the "moons" dataset
    X_np, y_np = make_moons(n_samples=1000, noise=0.15, random_state=42)

    # Split into train and validation sets
    X_train_np, X_val_np, y_train_np, y_val_np = train_test_split(
        X_np, y_np, test_size=0.2, random_state=42
    )

    # Convert to PyTorch tensors
    X_train = torch.tensor(X_train_np, dtype=torch.float32)
    y_train = torch.tensor(y_train_np, dtype=torch.float32).view(-1, 1)

    X_val = torch.tensor(X_val_np, dtype=torch.float32)
    y_val = torch.tensor(y_val_np, dtype=torch.float32).view(-1, 1)

    # Create DataLoaders
    train_loader = DataLoader(TensorDataset(X_train, y_train), batch_size=32, shuffle=True)
    val_loader = DataLoader(TensorDataset(X_val, y_val), batch_size=32, shuffle=False)

    # Build a slightly deeper model to handle the non-linear moons
    model = nn.Sequential(
        nn.Linear(2, 16),
        nn.ReLU(),
        nn.Linear(16, 16),
        nn.ReLU(),
        nn.Linear(16, 1),
    )

    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    return criterion, model, optimizer, train_loader, val_loader


@app.cell
def _(mo):
    mo.md("""
    ### 2. Tracking the Shapes

    Let's pause and look at exactly what happens to the tensor shapes during a single forward pass with our batch size of 32.
    """)
    return


@app.cell
def _(criterion, mo, model, train_loader):
    # Grab one batch
    xb, yb = next(iter(train_loader))

    # Forward pass
    logits = model(xb)
    loss = criterion(logits, yb)

    shape_table = mo.md(f"""
    | Quantity | Shape | Meaning |
    | :--- | :--- | :--- |
    | `xb` | `{tuple(xb.shape)}` | 32 examples, each with 2 features |
    | `logits` | `{tuple(logits.shape)}` | one raw output score per example |
    | `yb` | `{tuple(yb.shape)}` | one target per example |
    | `loss` | `{tuple(loss.shape)}` | one scalar summarizing the batch |
    """)
    shape_table
    return


@app.cell
def _(mo):
    mo.md("""
    ### 3. The Complete Training Loop

    Now we wrap our forward pass, loss calculation, and backpropagation in a loop over 100 epochs. We'll also track the validation loss to make sure our model isn't just memorizing the training data.
    """)
    return


@app.cell
def _(criterion, model, optimizer, torch, train_loader, val_loader):
    epochs = 100
    train_losses = []
    val_losses = []

    for epoch in range(epochs):
        # --- Training Phase ---
        model.train() # Switch model to training mode
        epoch_train_loss = 0.0

        for batch_x, batch_y in train_loader:
            # 1. Make a guess (Forward pass)
            batch_logits = model(batch_x)

            # 2. Score the mistake (Loss calculation)
            batch_loss = criterion(batch_logits, batch_y)

            # 3. Clear old gradients
            optimizer.zero_grad()

            # 4. Send the signal backward (Backpropagation)
            batch_loss.backward()

            # 5. Nudge the parameters (Update step)
            optimizer.step()

            epoch_train_loss += batch_loss.item()

        train_losses.append(epoch_train_loss / len(train_loader))

        # --- Validation Phase ---
        model.eval() # Switch model to evaluation mode
        epoch_val_loss = 0.0

        with torch.no_grad(): # Don't track gradients for validation
            for val_x, val_y in val_loader:
                val_logits = model(val_x)
                val_loss = criterion(val_logits, val_y)
                epoch_val_loss += val_loss.item()

        val_losses.append(epoch_val_loss / len(val_loader))
    return epochs, train_losses, val_losses


@app.cell
def _(epochs, go, mo, train_losses, val_losses):
    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=list(range(1, epochs + 1)), 
        y=train_losses, 
        mode='lines', 
        name='Training Loss', 
        line=dict(color='#3b82f6', width=2.5)
    ))

    fig.add_trace(go.Scatter(
        x=list(range(1, epochs + 1)), 
        y=val_losses, 
        mode='lines', 
        name='Validation Loss', 
        line=dict(color='#f97316', width=2.5, dash='dash')
    ))

    fig.update_layout(
        title="Training vs Validation Loss",
        xaxis_title="Epoch",
        yaxis_title="Loss",
        template="plotly_white",
        height=400,
        margin=dict(l=20, r=20, t=40, b=20),
        legend=dict(yanchor="top", y=0.99, xanchor="right", x=0.99)
    )

    mo_fig = mo.ui.plotly(fig)
    mo_fig
    return


if __name__ == "__main__":
    app.run()
