# K-Means Clustering & The Elbow Method

In modern commerce, treating all customers identically leads to suboptimal marketing returns and high churn. **K-Means Clustering** is the preeminent unsupervised machine learning algorithm used to partition unlabeled datasets into $K$ distinct, non-overlapping behavioral clusters based on geometric feature proximity.

---

## 1. How K-Means Works: The Lloyd-Forgy Algorithm

1. **Initialization:** Select $K$ initial centroid coordinates at random (or via K-Means++).
2. **Assignment Step:** Assign each data point to its nearest centroid using Euclidean distance:
   $$d(x, c_j) = \sqrt{\sum_{i=1}^{p} (x_i - c_{ji})^2}$$
3. **Update Step:** Recalculate each centroid as the geometric mean of all data points assigned to it.
4. **Convergence:** Repeat steps 2 and 3 until centroids stabilize (inertia stops decreasing).

---

## 2. Choosing Optimal $K$: The Elbow Method & Inertia

Because K-Means is unsupervised, there are no ground-truth labels. Analysts use **Inertia (Within-Cluster Sum of Squares - WCSS)**:

$$WCSS = \sum_{k=1}^{K} \sum_{x \in C_k} ||x - \mu_k||^2$$

As $K$ increases, WCSS naturally drops towards zero (if $K=N$, WCSS=0). The **Elbow Method** finds the point of diminishing marginal returns:

```python
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Step 1: ALWAYS scale features before K-Means!
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[['recency', 'frequency', 'monetary']])

# Step 2: Compute WCSS for K = 1 to 10
wcss = []
k_range = range(1, 11)
for k in k_range:
    kmeans = KMeans(n_clusters=k, init='k-means++', random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    wcss.append(kmeans.inertia_)

# Step 3: Plot Elbow Curve
plt.figure(figsize=(8, 5))
plt.plot(k_range, wcss, marker='o', linestyle='--', color='b')
plt.title('The Elbow Method for Optimal K')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('WCSS (Inertia)')
plt.grid(True)
plt.show()
```

---

## 3. Validating with Silhouette Score

When the elbow curve is ambiguous, calculate the **Silhouette Score** (ranges from -1 to +1):
- Near +1: Clusters are dense and cleanly separated.
- Near 0: Clusters overlap significantly.
- Negative: Points are assigned to the wrong cluster.

```python
from sklearn.metrics import silhouette_score

for k in range(2, 7):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X_scaled)
    sil = silhouette_score(X_scaled, labels)
    print(f"K = {k} | Silhouette Score: {sil:.3f}")
```

---

## 4. Profiling Clusters for Business Strategy

After assigning cluster labels, profile each cluster by calculating unscaled feature means:

```python
df['cluster'] = kmeans.fit_predict(X_scaled)
cluster_profiles = df.groupby('cluster')[['recency', 'frequency', 'monetary']].mean()
print(cluster_profiles)
```

---

# Multiple Choice Questions

### 1. Why is feature scaling mandatory before running K-Means clustering?
A. K-Means algorithms will crash on unscaled data.
B. K-Means uses Euclidean distance; unscaled features with large numerical magnitudes (e.g., annual revenue in thousands) will completely dominate the distance metric over features with small scales (e.g., age).
C. Scaling transforms unsupervised learning into supervised learning.
D. Scaling removes missing values automatically.
**Answer:** B
**Explanation:** Euclidean distance calculates squared differences across dimensions. A difference of 5,000 in income will overpower a difference of 2 in years of experience unless standardized.
---

### 2. What does the "Elbow Point" represent in an Elbow plot of K-Means clustering?
A. The cluster count where WCSS equals zero.
B. The point of inflection where adding further clusters yields diminishing marginal reductions in inertia (WCSS).
C. The maximum silhouette score.
D. The number of iterations required to converge.
**Answer:** B
**Explanation:** The elbow indicates where additional clusters stop explaining substantial variance, offering an optimal balance between cluster compactness and model simplicity.
---

### 3. What does a Silhouette Score close to +1.0 indicate?
A. Severe data leakage.
B. Excellent clustering: samples are tightly grouped within their own cluster and well separated from neighboring clusters.
C. The clusters have high overlap and ambiguous boundaries.
D. Points have been assigned to the wrong clusters.
**Answer:** B
**Explanation:** Silhouette scores measure intra-cluster cohesion versus inter-cluster separation. Values approaching +1 indicate distinct, well-defined clusters.
---

### 4. What is the main advantage of the `init='k-means++'` initialization algorithm over pure random initialization?
A. It guarantees that the resulting clusters will be spherical.
B. It smartly spreads out initial centroids across data space, preventing poor local minima convergence and accelerating convergence speed.
C. It eliminates the need to specify $K$.
D. It handles text data natively.
**Answer:** B
**Explanation:** `k-means++` selects initial centroids with probability proportional to their squared distance from existing centroids, avoiding unlucky clustered initial seeds.
---

### 5. If $K$ is set equal to the total number of observations ($N$) in the dataset, what is the value of Inertia (WCSS)?
A. Infinity
B. 0.0
C. 1.0
D. -1.0
**Answer:** B
**Explanation:** If every data point has its own personal cluster centroid, the distance from each point to its centroid is 0, making total WCSS equal to 0.
---