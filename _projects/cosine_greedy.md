---
layout: page
title: "SimMS: GPU-Accelerated Cosine Similarity"
description: Fast chemical search with GPU cosine similarity.
img: https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/cosine-batch-thum.svg
importance: 1
category: large projects
---

Search engines are important when there is a lot of data. Chemistry, just like the internet, has produced a *looot* of chemical experimental data. These chemical data are published in large online [repositories](https://ccms-ucsd.github.io/GNPSDocumentation/) that can reach petabytes in size and contain billions of entries.

Search engines like Google, Bing, and GoDaddy find a list of webpages given search text. Similarly, a chemist might try to find a list of relevant chemicals given a chemical query. In practice the "search engine" for chemicals is a program like [MatchMS](https://github.com/matchms/matchms). In MatchMS, chemical experiments (called "mass spectra") are compared using an algorithm called "cosine greedy" that outputs a percentage similarity (similarity from 0% to 100%):

<!-- ** Histogram with blue peaks and red peaks, histograms get overlapped, close peaks get toleranced, divide toleranced peaks with everything equals score ** -->

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/cosine-anim.svg)

Similar chemicals produce similar mass spectra, and mass spectra of chemicals are relatively easy to obtain. This makes searching and comparing mass spectra an important aspect of chemical discovery. 

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/easy-comp.svg)

Unfortunately, Cosine Greedy is *computationally* very expensive at scale. Running a Cosine Greedy algorithm for a single search query can take over a *month* of CPU time. To solve the computational problem, some researchers tried [to approximate it](https://github.com/biorack/blink) to trade quality for speed. In many applications, however, the [exact algorithm](https://matchms.readthedocs.io/en/latest/?badge=latest#example) is required. 


## The solution

[SimMS](https://github.com/PangeAI/simms) is solves this computational problem. SimMS uses the *exact* Cosine Greedy algorithm but runs it on an NVIDIA GPU. This leads to some incredible speedups. Using just one H100, SimMS executes **1700x** faster than an `i9` CPU. SimMS runs on smaller gaming RTX4090 GPUs **800x** faster. These performance gains come from the way SimMS fits onto the GPU hardware, instead of algorithmic tricks.

The first reason for the performance is that SimMS works in batches of data, while the CPU only works on individual pairs of data. SimMS by default compares a batch of 2048 * 2048 chemicals in one step:

<!-- ** Grid of chemicals: red cell moves (this is CPU) and calculates each point at a time, Grid of chemicals red block moves (this is GPU) and calculates many in one shot ** -->
![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/cosine-batch.svg)

This works well because each spectrum is loaded just once from the memory in a batch, and is then reused many times for the similarity calculations within the batch. The slowest part of any program is the memory access and this approach improves the memory bottleneck.

Another important reason for the speed is the nature of the GPU memory itself. Modern GPU memory systems allow reading the main memory with very high throughput. The GPU memory system is not exactly *fast*, but more like a cargo train -- it can transport a lot of data per unit of time. SimMS uses this correctly and this is the second main reason why it is so fast.

Algorithmically, SimMS is simply the cosine greedy algorithm applied in parallel on batches of chemicals. The larger the batch and the GPU memory bandwidth, the better the performance. 

## CPU algorithm

Comparing chemicals with cosine is more involved than the above image shows. Each chemical is stored in memory as a pair of two arrays called `mz` and `intensity`. Comparing two chemicals involves the following 4 steps:

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/cosine-details.svg)

Or, written as pseudo-Python, the following:

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

The above is the innermost section of the algorithm. To compare N by M similarity matrix, a double loop is used:

```py
# File: matrix_similarity.py
# Inputs: Pairs of many spectra, rlist and qlist
matrix = []
for i, rspec in enumerate(rlist):
  for j, qspec in enumerate(qlist):
    matrix[i,j] = cosine_similarity(rspec, qspec)
```

That loop, even on the best hardware and hundreds of CPUs, takes **weeks** to complete. 

## GPU Algorithm

The main insight is recognizing the parallelism of cosine greedy calculation. All the `matrix[i,j]` entries are independent from one another. So figuring out how to fit this problem onto an NVIDIA GPU was half the solution. Below is a visual guide on how the problem was fit to a GPU:

![](https://github.com/tornikeo/cdn/raw/master/assets/cosine_greedy/gpu_run.png)


Step 1: stack all references and queries on top of each other, into a 2D array. Step 2: allocate a 2D similarity array on a GPU. Step 3: assign each CUDA thread to process a single spectrum-to-spectrum comparison, with the exact Cosine Similarity algorithm. Finally, in step 4, transfer all results from the GPU 2D similarity array back to the CPU. This completes the run. In code, that would look something like this:

```py
# Input: Many References and queries
# Output: Similarity matrix of all-vs-all spectra

for references_chunk in batch(references, batch_size=3): # 3 per batch; in practice 2048 is used
  references_batch = spectra_to_contiguous_array(references_chunk)
  for queries_chunk in batch(queries, batch_size=2):
    queries_batch = spectra_to_contiguous_array(queries_chunk)

    # Outputs for GPU to write in must be pre-allocated
    batch_results = empty_array(2, 3) # 3 references and 2 queries
    
    # GPU kernel is launched
    kernel(references_batch, queries_batch, batch_results)

    # The batch matrix similarity is transferred back to the CPU
    batch_results.to_cpu()
```

The *magic* happens here during the kernel launch `kernel(references_batch, queries_batch, batch_results)`. The GPU crunches the entire batches of data in just a fraction of a second, allowing the full process to finish in under a couple of minutes instead of days. 

After the processing is done, another engineering challenge appears - it turns out that storing N by M matrix of similarities becomes infeasible after N and M reach respectable sizes (100k vs 1mln). Therefore, one last step involves converting the current batch to a sparse matrix format before storing it into memory. This is controlled by the keyword argument `array_type: Literal["numpy", "sparse"]`. 

## Conclusion

Huge amounts of data require highly specialized tools. Researchers that rely on MS/MS have access to large amounts of mass spectrometry data. Searching through this data is like looking for a needle in a massive haystack. This process, as shown above, is easily parallelizable. Parallelism, when coupled with GPU technology, can be used to achieve incredibly performant solutions. This GPU-centric approach allows search to happen up to **1700x** faster than the latest-gen CPUs, making MS/MS research more accessible for everyone.