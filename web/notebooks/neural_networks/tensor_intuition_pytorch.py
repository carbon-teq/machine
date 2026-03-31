import marimo

__generated_with = "0.20.4"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import torch

    return mo, torch


@app.cell
def _(mo):
    mo.md(r"""
    # Tensor Intuition in PyTorch

    This notebook keeps the code visible on purpose.

    The goal is not to memorize PyTorch syntax. The goal is to build one clear picture:

    - a **tensor** is a container of numbers with a shape
    - shapes tell us how data is organized
    - PyTorch gives us direct operations for indexing, dot products, and matrix multiplication
    - for these examples, we stay on the **CPU** so the ideas stay simple

    Read the code, run your eye over the shapes, and connect each operation to the kind of object it acts on.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## The Architecture of Data

    A tensor is simply a container of numbers with a specific **shape**.

    Instead of thinking of tensors as advanced mathematical objects, think of them as the physical layout of your data. The shape tells us exactly how the numbers are arranged.
    """)
    return


@app.cell
def _(torch):
    # A single number (0 dimensions)
    scalar = torch.tensor(3.0)

    # One house with 3 features (1 dimension)
    vector = torch.tensor([3.0, 2.0, 1500.0])

    # A batch of 4 houses, each with 2 features (2 dimensions)
    batch = torch.tensor([
        [3.0, 2.0],
        [4.0, 3.0],
        [2.0, 1.0],
        [5.0, 4.0],
    ])
    return batch, scalar, vector


@app.cell
def _(batch, mo, scalar, vector):
    rows = [
        {"name": "scalar", "shape": str(tuple(scalar.shape)), "example": str(scalar)},
        {"name": "vector", "shape": str(tuple(vector.shape)), "example": str(vector)},
        {"name": "batch", "shape": str(tuple(batch.shape)), "example": str(batch)},
    ]

    mo.vstack(
        [
            mo.md(
                r"""
                When you see a shape like `(4, 2)`, it is telling you a story:
                - We are processing `4` examples simultaneously.
                - Each example has `2` distinct features.
                """
            ),
            mo.ui.table(rows),
        ]
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Pointing at the Data

    Once we have our data packed into a solid block, we need a way to point at specific pieces of it. Because tensors are structured, we can slice them exactly like grids.
    """)
    return


@app.cell
def _(batch):
    first_house = batch[0]
    second_feature = batch[:, 1]
    one_entry = batch[2, 0]
    first_two_houses = batch[:2]

    indexing_code = """batch = torch.tensor([
        [3.0, 2.0],
        [4.0, 3.0],
        [2.0, 1.0],
        [5.0, 4.0],
    ])

    batch[0]      # first house
    batch[:, 1]   # second feature (all houses)
    batch[2, 0]   # first feature of third house
    batch[:2]     # first two houses"""

    indexing_output = f"""batch[0]    -> {first_house}
    batch[:, 1] -> {second_feature}
    batch[2, 0] -> {one_entry}
    batch[:2]   -> {first_two_houses}"""
    return indexing_code, indexing_output


@app.cell
def _(indexing_code, indexing_output, mo):
    mo.md(
        f"""
    ```python
    {indexing_code}
    ```

    ```python
    {indexing_output}
    ```
    """
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## The "Aha!" Moment: Why We Need `@`

    Suppose we have our batch of 4 houses, each with 2 features. We also have a set of "weights" that tell us how important each feature is. We want to multiply our houses by our weights to get a prediction.
    """)
    return


@app.cell
def _(batch, torch):
    weights = torch.tensor([
        [50.0],  # $50k per bedroom
        [25.0],  # $25k per bathroom
    ])

    # Element-wise multiplication (not what we want for predictions)
    elementwise_attempt = batch * torch.tensor([50.0, 25.0])

    # Matrix multiplication (what we want)
    predictions = batch @ weights

    mm_code = """batch = torch.tensor([
        [3.0, 2.0],
        [4.0, 3.0],
        [2.0, 1.0],
        [5.0, 4.0],
    ]) # shape: (4, 2)

    weights = torch.tensor([
        [50.0],
        [25.0],
    ]) # shape: (2, 1)

    # Matrix Multiplication
    predictions = batch @ weights"""

    mm_output = f"""batch.shape   -> {tuple(batch.shape)}
    weights.shape -> {tuple(weights.shape)}
    predictions   -> {predictions}
    predictions.shape -> {tuple(predictions.shape)}"""
    return mm_code, mm_output


@app.cell
def _(mm_code, mm_output, mo):
    mo.md(
        f"""
    If we try to use standard multiplication `*`, PyTorch will try to match up the numbers element by element. 

    We don't want element-wise multiplication. We want to apply our `(2, 1)` weights to *every single row* of our `(4, 2)` batch simultaneously.

    We need **Matrix Multiplication**, represented in PyTorch by the `@` symbol.

    ```python
    {mm_code}
    ```

    ```python
    {mm_output}
    ```

    Look at what happens to the shapes:
    $$
    (4, 2) @ (2, 1) \rightarrow (4, 1)
    $$

    The inner dimensions (`2` and `2`) snap together and collapse. We are left with a shape of `(4, 1)`: exactly 4 predictions, one for each house. We just processed the entire batch in a single operation, without a single `for` loop.
    """
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## The Reality Check: Adapting Shapes

    In the real world, your data rarely arrives in the exact perfect shape for matrix multiplication. Sometimes the numbers are right, but the Lego blocks won't snap together.

    This is why PyTorch gives us tools to bend and adapt our tensors:
    """)
    return


@app.cell
def _(torch):
    v = torch.tensor([1.0, 2.0, 3.0])
    row = v.unsqueeze(0)
    column = v.unsqueeze(1)
    transposed = column.T

    shape_code = """v = torch.tensor([1.0, 2.0, 3.0])

    v.shape
    v.unsqueeze(0).shape
    v.unsqueeze(1).shape
    v.unsqueeze(1).T.shape"""

    shape_output = f"""v.shape               -> {tuple(v.shape)}
    v.unsqueeze(0).shape  -> {tuple(row.shape)}
    v.unsqueeze(1).shape  -> {tuple(column.shape)}
    v.unsqueeze(1).T.shape -> {tuple(transposed.shape)}"""
    return shape_code, shape_output


@app.cell
def _(mo, shape_code, shape_output):
    mo.md(
        f"""
    ```python
    {shape_code}
    ```

    ```python
    {shape_output}
    ```

    - `unsqueeze(0)` adds a new axis in front
    - `unsqueeze(1)` adds a new axis after the first one
    - `.T` swaps rows and columns for a 2D tensor

    Whenever a matrix multiplication fails with a "shape mismatch" error, your first instinct should be to check if you need to `unsqueeze` an axis or transpose (`.T`) a matrix to make the inner dimensions line up.
    """
    )
    return


if __name__ == "__main__":
    app.run()
