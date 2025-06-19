---
layout: page
title: "SimMS: GPU-accelerated Cosine Similarity"
description: GPU acceleration can make cosine similarity searches in metabolomics data up to 1700x faster, with open-source code and practical implementation details
img: https://storage.googleapis.com/tornikeo-portfolio-cdn/cuda_cube.jpg
importance: 1
category: large projects
---

## Intro
Metabolomics is a scientific field that is suffering from success. This field of bioinformatics enjoys access to vast quantities of high-quality, publicly available mass spectral data. And this is exactly the problem. The size of the available data makes search a real slog, even for the best systems. Fortunately, there's something very special about the search: The core algorithm is embarrassingly parallel. We exploited this property to make search **1700x** faster using NVIDIA GPUs. We also wrote a [paper](https://doi.org/10.1093/bioinformatics/btaf081) about it and [open-sourced the code](https://github.com/PangeAI/simms).

If you want to learn more about this field, check out "Mass Spectrometry: Principles and Applications" by Hoffmann and Stroobant. I'll instead jump straight into the computational algorithm.

## Cosine similarity
The algorithm is called Cosine Similarity. It calculates (in percentage %) how similar two mass spectra are. It consists of four steps:

![](https://github.com/tornikeo/cdn/raw/master/assets/cosine_greedy/cosine.png)

We start with two mass spectra: query and reference. Spectra consist of two arrays, a mass array (called `mz`), and an intensity array. The second step is to find all mass values that are close. The "good match" threshold is a tunable parameter. In the third step, we sort the matched mass pairs by their intensity product. Finally, we choose the best combination of pairs to get the score. As an algorithm, this looks like the following:

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

That loop, even on the best hardware and hundreds of CPUs, takes **weeks** to complete. The program we developed works in **minutes**, using a single NVIDIA GPU. And the fun thing is we didn't even change the algorithm. The GPU program outputs are exact—they are not an approximation.

## Implementation
So, how does this work? The idea was pretty simple—NVIDIA GPUs are famous for their ability to run parallel programs really quickly. If you look at the `matrix_similarity.py` code above, you will notice that all the `matrix[i,j]` entries can be computed independently, i.e., in parallel. So all we had to do was figure out how to fit this problem onto an NVIDIA GPU. Below is a visual guide on how we fit the problem to a GPU:

![](https://github.com/tornikeo/cdn/raw/master/assets/cosine_greedy/gpu_run.png)

Step 1: stack all references and queries on top of each other, into a 2D array. Step 2: allocate a 2D similarity array on a GPU. Step 3: assign each CUDA thread to process a single spectrum-to-spectrum comparison, with the exact Cosine Similarity algorithm. Finally, in step 4, transfer all results from the GPU 2D similarity array back to the CPU. This completes the run. In code, that would look something like this:

```py
# Input: Many References and queries
# Output: Similarity matrix of all-vs-all spectra

for references_chunk in batch(references, batch_size = 3): # 3 per batch, in practice we use 2048
  references_batch = spectra_to_contiguous_array(references_chunk)
  for queries_chunk in batch(queries, batch_size = 2):
    queries_batch = spectra_to_contiguous_array(queries_chunk)

    # We have to pre-allocate outputs for GPU to write in
    batch_results = empty_array(2, 3) # 3 references and 2 queries
    
    # Run GPU 🔥🔥🔥
    kernel(references_batch, queries_batch, batch_results)

    # Transfer batch matrix similarity back to CPU
    batch_results.to_cpu()
```

This is a simplified version of what is [really happening](https://github.com/pangeai/simms/blob/main/simms/similarity/spectrum_similarity_functions.py). On any decent GPU, like an RTX4090, Tesla V100, or even RTX2070, this approach is at least **200x** faster than a CPU. If you test this on an H100, you will see a **1700x** speedup compared to a CPU. This approach makes it possible to find some really neat connections between massive datasets of mass spectra on a shoestring budget. You can even use it for free, with [a Google Colab notebook](https://colab.research.google.com/github/PangeAI/simms/blob/main/notebooks/samples/colab_tutorial_pesticide.ipynb).

## Conclusion

Huge amounts of data can be both a blessing and a curse. Metabolomics researchers have access to large amounts of mass spectrometry data. Searching in this data is like looking for a needle in a haystack. This process, as we discovered, is highly parallelizable. We exploited this property to impressive results. The GPU-centric approach allows searching to proceed at 1700x the speed of even the fastest CPUs, making this part of the research cheap and accessible.
