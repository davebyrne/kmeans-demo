# K-Means Convergence demo.

This app is a demonstration of the convergence process of K-Means clustering using [d3.js](https://d3js.org/).

You can view the demo [here](https://davebyrne.github.io/kmeans-demo/)

## About K-Means

K-Means is an unsupervised clustering process that attempts to group data into K number of clusters.  

The K-Means clustering process is as follows:

- Select K random data points to use as the initial clusters
- For each data point, calculate the distance to each cluster center and assign it a cluster membership
- For each cluster grouping,  calculate the center of the cluster by calculating the average value of each point in the cluster, and move the cluster center to the new point
- Given the new clusters, calculate the distance to each data point and re-assign cluster membership
- Repeat this process untill either the cluster centers stop moving (less than delta threshold), or the max number of iterations has been completed.

If the maximum number of iterations have not been reached, and the clusters have stopped moving more than the delta threshold, the cluster can be described as "converged".

Note: Because the first step in K-Means is to select random data points to use as initial clusters,  repeat runs on the same dataset will end up with different cluster groupings.  A large number of runs can be used to find the "Best" clusters.