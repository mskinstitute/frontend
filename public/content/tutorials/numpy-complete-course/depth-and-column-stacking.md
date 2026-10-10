# Depth & Column Stacking: dstack(), column_stack(), & stack()

While `vstack` and `hstack` handle basic 2D horizontal and vertical stacking, real-world data science and computer vision problems frequently require working along other axes:
- Merging independent grayscale channels into a multi-channel RGB or RGBA image tensor.
- Stacking 1D feature vectors side-by-side as columns in a 2D design matrix.
- Stacking arrays along an entirely **new dimension** (such as stacking multiple time-series frames).

---

## 1. Column Stacking: `np.column_stack()`

`np.column_stack()` takes a sequence of 1D arrays and stacks them as columns into a single 2D matrix. This is one of the cleanest, most idiomatic ways in NumPy to assemble tabular feature matrices from separate 1D variables:

```python
import numpy as np

# Feature vectors
feature_age = np.array([25, 30, 45, 52])
feature_income = np.array([55000, 68000, 110000, 95000])
feature_credit = np.array([710, 680, 790, 740])

# Assemble into a 2D design matrix (4 samples x 3 features)
design_matrix = np.column_stack((feature_age, feature_income, feature_credit))
print("Design Matrix (Shape:", design_matrix.shape, "):
", design_matrix)
```

**Output:**
```text
Design Matrix (Shape: (4, 3) ):
 [[    25  55000    710]
 [    30  68000    680]
 [    45 110000    790]
 [    52  95000    740]]
```

> Note: For 2D arrays, `column_stack()` behaves identically to `hstack()`.

---

## 2. Depth Stacking: `np.dstack()`

`np.dstack()` stacks arrays along **axis 2 (the depth axis)**.

This is the standard operation for assembling color images from separate 2D color channel planes:

```python
# Create three 2D color channels (e.g. 4x4 image)
red_channel   = np.full((4, 4), 255, dtype=np.uint8)
green_channel = np.full((4, 4), 128, dtype=np.uint8)
blue_channel  = np.zeros((4, 4), dtype=np.uint8)

# Stack along depth to construct an RGB image tensor of shape (4, 4, 3)
rgb_image = np.dstack((red_channel, green_channel, blue_channel))
print("RGB Image Tensor shape:", rgb_image.shape)  # (4, 4, 3)
print("Pixel (0, 0) RGB values:", rgb_image[0, 0])  # [255, 128, 0]
```

---

## 3. Creating New Axes with `np.stack()`

Notice the critical conceptual difference between `np.concatenate()` and `np.stack()`:
- `np.concatenate()`: Joins arrays along an **existing** axis. Output has the **same** number of dimensions (`ndim`).
- `np.stack()`: Joins arrays along a **NEW** axis. Output has **ndim + 1** dimensions.

```python
frame1 = np.ones((10, 10))
frame2 = np.ones((10, 10)) * 2
frame3 = np.ones((10, 10)) * 3

# Stack 2D frames into a 3D video clip along axis 0: shape (3, 10, 10)
video_clip = np.stack((frame1, frame2, frame3), axis=0)
print("Stacked axis 0 shape:", video_clip.shape)

# Stack along axis -1: shape (10, 10, 3)
video_channels = np.stack((frame1, frame2, frame3), axis=-1)
print("Stacked axis -1 shape:", video_channels.shape)
```

---

## 4. Summary of Stacking Helpers

| Function | Effective Behavior | Dimensionality Change | Typical Use Case |
| :--- | :--- | :--- | :--- |
| `np.concatenate` | Joins along existing axis | Same `ndim` | Appending rows or columns |
| `np.stack` | Joins along brand new axis | `ndim + 1` | Batching images, time-series frames |
| `np.vstack` | Row-wise stacking | Promotes 1D $\to$ 2D | Appending sample rows |
| `np.hstack` | Column-wise for 2D, 1D concat | Same or 2D | Horizontal image tiling |
| `np.column_stack`| 1D arrays as columns | Always 2D | ML design matrices |
| `np.dstack` | Stacks along 3rd axis (depth) | Promotes to 3D | RGB channel merging |

---

# Multiple Choice Questions

### 1. How does `np.stack()` differ fundamentally from `np.concatenate()`?
A. `np.stack()` runs faster because it does not allocate memory
B. `np.stack()` joins arrays along a brand new axis, increasing dimensionality by 1
C. `np.stack()` can only accept two arrays
D. `np.stack()` flattens all inputs
**Answer:** B
**Explanation:** While `np.concatenate()` joins along an already existing dimension preserving `ndim`, `np.stack()` creates and inserts a brand new dimension, increasing `ndim` by 1.

---

### 2. If you have three 1D arrays of shape `(100,)`, what is the shape of the output from `np.column_stack((a, b, c))`?
A. (300,)
B. (3, 100)
C. (100, 3)
D. (100, 1, 3)
**Answer:** C
**Explanation:** `np.column_stack()` takes 1D vectors and aligns each as a column in a 2D matrix, producing shape `(100, 3)`.

---

### 3. Which function is most appropriate for combining three 2D matrices of shape (1080, 1920) representing Red, Green, and Blue into a standard image array of shape (1080, 1920, 3)?
A. `np.vstack`
B. `np.hstack`
C. `np.dstack`
D. `np.concatenate(..., axis=0)`
**Answer:** C
**Explanation:** `np.dstack()` stacks along the third axis (depth / axis 2), turning `(H, W)` 2D planes into an `(H, W, 3)` 3D volume.

---

### 4. What is the output shape of `np.stack([np.zeros((4, 5)), np.zeros((4, 5))], axis=1)`?
A. (4, 2, 5)
B. (2, 4, 5)
C. (4, 10)
D. (8, 5)
**Answer:** A
**Explanation:** Stacking two arrays of shape `(4, 5)` along `axis=1` inserts the new axis of size 2 at index 1, yielding shape `(4, 2, 5)`.

---

### 5. When using `np.stack()`, what condition must all input arrays satisfy?
A. They must be 1D
B. They must have identical dtypes and exactly the same shape
C. They must be C-contiguous
D. They must have fewer than 1000 elements
**Answer:** B
**Explanation:** All arrays passed to `np.stack()` must have the exact same shape, because they are being aligned along a newly introduced axis.

---