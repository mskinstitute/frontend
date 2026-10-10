# Efficient File I/O: .npy, .npz, & CSV/Text Files

Scientific workflows require saving intermediate computations, persisting trained model parameters (such as neural network weights), and loading experimental measurement files.

While CSV or text formats are human-readable, they are notoriously slow to parse and consume immense disk space. NumPy provides **optimized binary storage formats (`.npy` and `.npz`)** that read and write data at raw disk bus bandwidth.

---

## 1. Comparing Storage Formats

| Feature | Plain Text / CSV | Single Binary (`.npy`) | Compressed Archive (`.npz`) |
| :--- | :--- | :--- | :--- |
| **Speed** | Slow (Text $\leftrightarrow$ float conversion) | **Lightning fast** (raw memory dump) | Fast with high compression |
| **File Size** | Bloated text characters | Compact binary | **Minimal** (ZIP compressed) |
| **Metadata** | None (dtypes/shapes lost) | **Preserves shape & dtype** | Preserves multiple shapes/dtypes |
| **Multi-Array** | No (single table only) | Single array only | **Dictionary of arrays** |

---

## 2. Single Array Persistence: `.npy`

`.npy` is a simple binary format designed specifically for NumPy ndarrays. It stores the exact shape, dtype, and byte order in a tiny header, followed immediately by the raw binary memory buffer:

```python
import numpy as np
import os

# Create an array of weights
weights = np.random.randn(1000, 50)

# Save to disk
np.save("model_weights.npy", weights)
print("Saved model_weights.npy (File size:", os.path.getsize("model_weights.npy"), "bytes)")

# Load back into memory
loaded_weights = np.load("model_weights.npy")
print("Loaded shape:", loaded_weights.shape)
print("Are identical?", np.array_equal(weights, loaded_weights))

# Clean up temporary file
os.remove("model_weights.npy")
```

---

## 3. Multiple Arrays and Compression: `.npz`

When saving multiple related arrays—such as training data $X_{train}$, labels $y_{train}$, and test sets $X_{test}, y_{test}$—use `np.savez()` or **`np.savez_compressed()`**:

```python
X_train = np.random.randn(5000, 20)
y_train = np.random.randint(0, 2, 5000)
hyperparameters = np.array([0.01, 100.0, 0.9])

# Save multiple arrays in a compressed ZIP archive
np.savez_compressed(
    "dataset_bundle.npz",
    features=X_train,
    labels=y_train,
    config=hyperparameters
)

# Load the bundle
data_bundle = np.load("dataset_bundle.npz")
print("Stored array keys:", data_bundle.files)  # ['features', 'labels', 'config']

# Access individual arrays like a dictionary:
recovered_X = data_bundle['features']
recovered_y = data_bundle['labels']
print("Loaded features shape:", recovered_X.shape)

# Clean up
os.remove("dataset_bundle.npz")
```

---

## 4. Memory-Mapped Arrays for Huge Datasets (`mmap_mode`)

What if you need to inspect a 50 GB dataset on a laptop with only 16 GB of RAM? Standard loading would trigger an Out-of-Memory (OOM) crash.

NumPy supports **Memory Mapping (`mmap_mode`)**, which maps the array on disk directly into the virtual memory address space. NumPy reads slices from disk on-demand as they are accessed, without loading the full file into RAM:

```python
# Create a dummy large file
large_arr = np.arange(10_000_000, dtype=np.int64)
np.save("massive_file.npy", large_arr)

# Open in read-only memory-mapped mode (instantly returns without loading into RAM!)
mmap_arr = np.load("massive_file.npy", mmap_mode='r')
print("Mmap shape:", mmap_arr.shape)

# Read only a small slice from disk on-demand:
sample_slice = mmap_arr[500_000:500_010]
print("Read slice on demand:", sample_slice)

# Clean up
del mmap_arr  # close file handle
os.remove("massive_file.npy")
```

---

## 5. Text / CSV Files: `savetxt` and `genfromtxt`

When interoperability with spreadsheets or legacy software requires plain text CSV:

```python
table = np.array([
    [1.0, 25.5, 100.0],
    [2.0, 30.2, 150.0],
    [3.0, 18.9, 80.0]
])

# Save as CSV with header and format
np.savetxt("records.csv", table, delimiter=",", header="id,temp,pressure", comments="", fmt="%.2f")

# Load back
loaded_table = np.genfromtxt("records.csv", delimiter=",", skip_header=1)
print("Loaded from CSV:
", loaded_table)

os.remove("records.csv")
```

---

# Multiple Choice Questions

### 1. Which file extension represents NumPy's single binary array storage format?
A. `.npz`
B. `.npy`
C. `.dat`
D. `.h5`
**Answer:** B
**Explanation:** `.npy` is NumPy's standard binary format for persisting a single `ndarray` along with its shape and dtype metadata.

---

### 2. How are multiple arrays saved into a single compressed archive file in NumPy?
A. `np.save_all()`
B. `np.savez_compressed()`
C. `np.zip_arrays()`
D. `np.archive()`
**Answer:** B
**Explanation:** `np.savez_compressed()` bundles multiple named arrays into a single compressed `.npz` file (internally structured as a ZIP archive).

---

### 3. What is the key advantage of memory-mapped arrays using `np.load(..., mmap_mode='r')`?
A. It compresses arrays on disk using encryption
B. It allows reading and manipulating datasets larger than available system RAM by loading slices on-demand
C. It converts numbers to integers automatically
D. It increases GPU clock speed
**Answer:** B
**Explanation:** Memory mapping links the file on disk to virtual address space, reading chunks into memory only as referenced and evicting them when done, enabling out-of-core processing.

---

### 4. When loading an `.npz` file with `bundle = np.load('archive.npz')`, how do you inspect the names of the saved arrays?
A. `bundle.keys`
B. `bundle.files`
C. `bundle.names()`
D. `bundle.columns`
**Answer:** B
**Explanation:** An open `.npz` object provides a `.files` attribute containing a list of strings representing the internal array keys.

---

### 5. Why is `.npy` substantially faster than CSV for saving and loading numerical data?
A. `.npy` files are encrypted
B. `.npy` dumps raw contiguous binary bytes directly to disk without costly string conversions or text parsing
C. CSV only supports integer values
D. NumPy converts CSVs into XML first
**Answer:** B
**Explanation:** Text/CSV requires parsing ASCII characters into IEEE floating-point numbers on every read. `.npy` performs direct binary memory-to-disk copies at hardware bus speeds.

---