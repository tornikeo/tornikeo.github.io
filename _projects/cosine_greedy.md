---
layout: page
title: "SimMS: GPU-Accelerated Cosine Similarity"
description: Fast chemical search with GPU cosine similarity.
img: https://storage.googleapis.com/tornikeo-portfolio-cdn/cuda_cube.jpg
importance: 1
category: large projects
---

Search engines are important when there's an abundance of data. Chemistry, just like the internet, contains a sea of loosely-related chemical experiments. These experiments are published in large online [repositories](https://ccms-ucsd.github.io/GNPSDocumentation/) that can reach petabytes in size.

Internet pages are linked using `<a href="...">` tags. Chemicals are linked by their shapes. Finding related chemicals is much more complicated than to discover related websites. 

Instead two chemical experiments (called "mass spectra") are compared using an algorithm called "cosine greedy":

<!-- ** Histogram with blue peaks and red peaks, histograms get overlapped, close peaks get toleranced, divide toleranced peaks with everything equals score ** -->

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/cosine-anim.svg)

There are no *free* shortcuts to this algorithm. You can [approximate it](https://github.com/biorack/blink) but this results in worse search results. If you use the [exact algorithm](https://matchms.readthedocs.io/en/latest/?badge=latest#example), a single search query will take a *month* to run. 

## The solution

[SimMS](https://github.com/PangeAI/simms) uses the *exact* algorithm and simply runs it on an NVIDIA GPU. On a single H100, SimMS is x1700 faster than an `i9-14900HX` CPU. On an RTX4090 it is x800 faster. It is 100% exact. 

The secret to this performance is that SimMS works in batches, while the CPU only works in items. SimMS compares a batch of 2048 * 2048  chemicals in one step:

<!-- ** Grid of chemicals: red cell moves (this is CPU) and calculates each point at a time, Grid of chemicals red block moves (this is GPU) and calculates many in one shot ** -->
![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/cosine-batch.svg)

SimMS is simply the cosine greedy but applied in parallel on batches of chemicals. The larger the batch, the better the performance.

## Details and code

Comparing chemicals with cosine is more involved than the above image shows. Each chemical is stored in memory as a pair of two arrays called `mz` and `intensity`. Comparing two chemicals involves the following 4 steps:

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/cosine-details.svg)

Or, if written in Python, the following:

```py
# File cosine_similarity.py
# Inputs: Two arrays, r and q
# Outputs: score  %
r_spec = ([100, 200, 300, 500, 510], 
         [0.1, 0.2, 1.0, 0.3, 0.4])
q_spec = ([10, 40, 190, 490, 510],
          [0.9, 0.8, 1.0, 0.1, 0.7])

# Collect close mz pairs
pairs = []
for rmz, rint in r_spec:
  for qmz, qint in q_spec:
    if abs(rmz - qmz) < tol:
      pairs.append((rint, qint))

# Sort matching pairs by intensity product (rint*qint)
intensity_product = sorted([rint*qint for rint, qint in pairs])

# Choose pairs that 1) maximize total score and 2) use each rmz or qmz only once
used = {}
score = 0
for product in intensity_product[::-1]: # Largest products first
  if product not in used:
    score += product
    used.add(product)

return score
```

The real [implementation](https://github.com/matchms/matchms/blob/bf4f2c92a3f503c87289d46cd66f7583e262487b/matchms/similarity/CosineGreedy.py) is slightly more complex, but that's the gist of it. Pretty simple, right? Yes. The problem we solved is that of scaling *up*. Metabolomics researchers and [companies](https://www.pangeabio.com/our-work/pangeai) use the above algorithm to exhaustively compare thousands of spectra to datasets with millions of spectra. The search is essentially this pairwise loop:

```py
# File: matrix_similarity.py
# Inputs: Pairs of many spectra, rlist and qlist
matrix = []
for i, rspec in enumerate(rlist):
  for j, qspec in enumerate(qlist):
    matrix[i,j] = cosine_similarity(rspec, qspec)
```

That loop, even on the best hardware and hundreds of CPUs, takes **weeks** to complete. The program we developed works in **minutes**, using a single NVIDIA GPU. And the fun thing is, we didn't even change the algorithm. The GPU program outputs are exact, they are not an approximation.

## Implementation

So, how does this work? The idea was pretty simple, NVIDIA GPUs are famous for their ability to run parallel programs really quickly. If you look at the `matrix_similarity.py` code above, you will notice that all the `matrix[i,j]` entries can be computed independently, i.e., in parallel. So all we had to do was figure out how to fit this problem onto an NVIDIA GPU. Below is a visual guide on how we fit the problem to a GPU:

![](https://github.com/tornikeo/cdn/raw/master/assets/cosine_greedy/gpu_run.png)

Step 1: stack all references and queries on top of each other, into a 2D array. Step 2: allocate a 2D similarity array on a GPU. Step 3: assign each CUDA thread to process a single spectrum-to-spectrum comparison, with the exact Cosine Similarity algorithm. Finally, in step 4, transfer all results from the GPU 2D similarity array back to the CPU. This completes the run. In code, that would look something like this:

```py
# Input: Many References and queries
# Output: Similarity matrix of all-vs-all spectra

for references_chunk in batch(references, batch_size=3): # 3 per batch; in practice we use 2048
  references_batch = spectra_to_contiguous_array(references_chunk)
  for queries_chunk in batch(queries, batch_size=2):
    queries_batch = spectra_to_contiguous_array(queries_chunk)

    # We have to pre-allocate outputs for GPU to write in
    batch_results = empty_array(2, 3) # 3 references and 2 queries
    
    # Launch GPU kernel
    kernel(references_batch, queries_batch, batch_results)

    # Transfer batch matrix similarity back to CPU
    batch_results.to_cpu()
```

This is a simplified version of what [really happens](https://github.com/pangeai/simms/blob/main/simms/similarity/spectrum_similarity_functions.py). On any decent GPU, like an RTX4090, Tesla V100, or even RTX2070, this approach is at least **200x** faster than a CPU. If you test this on an H100, you will see a **1700x** speedup compared to a CPU. This approach makes it possible to find some really neat connections between massive datasets of mass spectra on a shoestring budget. You can even use it for free, with [a Google Colab notebook](https://colab.research.google.com/github/PangeAI/simms/blob/main/notebooks/samples/colab_tutorial_pesticide.ipynb).

## Conclusion

Huge amounts of data can be both a blessing and a curse. Metabolomics researchers have access to large amounts of mass spectrometry data. Searching in this data is like looking for a needle in a haystack. This process, as we discovered, is highly parallelizable. We exploited this property to impressive results. The GPU-centric approach allows searching to proceed at 1700x the speed of even the fastest CPUs, making this part of the research cheap and accessible.