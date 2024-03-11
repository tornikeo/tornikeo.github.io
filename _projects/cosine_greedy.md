---
layout: page
title: Giga-scale chemical similarity calculations with CUDA
description: Mass-spectrometry results hundreds of thousands of m/z spectra. How do we compare these with 1.5mln reference spectra?
img: https://storage.googleapis.com/tornikeo-portfolio-cdn/cuda_cube.jpg
importance: 1
category: large projects
---

In this post, I'll show how I created a new CUDA kernel for metabolomics research, what alternatives I considered, and what were the main technical difficulties with the implementation. I'll begin with introducing the field as a whole and the main computational challenge that requires a 
custom-made CUDA kernel. 

## Introduction

The field of [metabolomics](https://en.wikipedia.org/wiki/Metabolomics) is "...the "systematic study of the unique chemical fingerprints that specific cellular processes leave behind", ... study of their small-molecule metabolite profiles". That is, the domain of research involves an incredibly large number of chemicals, and, more importantly, the relationships between them. It is easy to see how massive the parallelism CUDA offers is extremely useful in this kind of domain.

Concretely, the task requirement is to optimize speed of [Greedy Cosine](matchms.readthedocs.io/en/latest/_modules/matchms/similarity/CosineGreedy.html) chemical similarity measure. I'll explain what *exactly* this means shortly.

## Greedy Cosine

Greedy cosine algorithm - what does it do:

Overall goal is to compare two chemicals, call them A, and B, and to output a percentage similarity, 0% for totally dissimilar chemicals, and 100% if A anb B happen to be the exact same molecule.

What complicates this calculation is that we aren't *given* chemicals themselves, but instead we are given their spectra.

Spectra is just a long list of tuples (called mz, and intensity). So, for example:

```py
A_mz = np.array([100, 200, 300, 500, 510], dtype="float")
A_intensity = np.array([0.1, 0.2, 1.0, 0.3, 0.4], dtype="float")

B_mz = np.array([10, 40, 190, 490, 510], dtype="float")
B_intensity = np.array([0.9, 0.8, 1.0, 0.1, 0.7], dtype="float")
```

That's the full information we get from a this pair of chemicals. Question is - how do we even define a reasonable similarity between these arrays?

Greedy Cosine is one of the many ways to compare these pairs of arrays. It does roughly the following:

```py
## Algorithm 1 (the thing that goes into the GPU)
# Accumulation step
candidates = []
for mz in A:
    for mz_b in B:
        if is_close(mz,mz_b)
            candidates.append(mz)

# Filter step
filtered = []
for mz in candidates:
    if is_best_candidate(mz, candidates):
        filtered.append(mz)
        remove_all_conflicting_candidates(candidates, mz)

# Normalize step
result = normalize(sum(filtered))
```

Keep in mind, this is just *one* of the ways of defining the similarity. This particular way comparing two spectra is a compute-efficient alternative to
calculating the mathematically *rigorous* cosine score using [Hungarian matching](https://matchms.readthedocs.io/en/latest/api/matchms.similarity.CosineHungarian.html). In practice, there's little difference between results of the two algorithms, so Greedy Cosine is a very popular comparison metric.

## `matchms` Limitations

`matchms` is a [python library](https://matchms.readthedocs.io/en/latest/) that "is an open-access Python package to import, process, clean, and compare mass spectrometry data (MS/MS)". It is a convenient tool to read device readings from an actual [spectrometry machine](https://en.wikipedia.org/wiki/Spectrometer), and convert that reading into easy-to-understand insights about the chemical composition of whatever was put into the machine for scanning.

Matchms heavily relies on `numba`, an important [python library](https://numba.readthedocs.io/en/stable/user/5minguide.html) that "is a just-in-time compiler for Python that works best on code that uses NumPy arrays and functions, and loops."

Unfortunately, matchms, even with using JIT-compiled optimized routines, is unbearably slow for even a modest of chemical pairs (10_000 chemicals compared with 10_000 other chemicals takes a bit over 2 days). We need to compare around 100_000 chemicals with 1_500_000 chemicals. This is completely intractable for `matchms`.

## Why a custom kernel?

Usually in my field, when a job involves writing a custom kernel, the main benefit of doing so is the possible performance gain. Also the performance gain depends on knowing your hardware-specific optimizations really well.

In our case, a custom kernel was a necessity given the nature of the algorithm and size of the problem. The core issue that prevents such an easy solution is that the algorithm fundamentally requires an `O(len(spetra))` disk space to accumulate unfiltered results before reducing these results to a single similarity number. ML GPU libraries do not have kernels that can selectively allocate temporary VRAM space per single GPU thread. This means that for every pair, the full memory has to be allocated, which makes even small batch sizes (100 x 100) infeasible to run. More on this in `Experiments` section.

## The kernel

The kernel was written fully using `numba.cuda.jit` [API](https://numba.pydata.org/numba-doc/latest/cuda/index.html). You can view the [source code](https://github.com/tornikeo/cosine-similarity/) online right now - and even [test it out using Colab in your browser](https://colab.research.google.com/github/tornikeo/cosine-similarity/blob/main/notebooks/samples/colab_tutorial_pesticide.ipynb)!

Now, let's talk about specifics:

We are given two large *lists*, called `references` and `queries`.

The references and queries **don't** have a consistent shape - shapes vary from 5 up to 30000! But length of most (99%) spectra are less than 1024.

So, the first step is to truncate spectra to that length, and convert them into homogeneous a contiguous array. We also allocate output space, and feed all three arrays to the GPU. 

This is described in Algorithm 2 (below):

```py
## Algorithm 2 (the thing that calls Algorithm 1 in batches)

# A nested for-loop, where every reference batch is compared with
# every query batch. This way, once we run out of batches, 
# we will have computed all similarities! And, we don't have to 
# allocate 100s of GBs of memory. Just enough for single batch.
for references_chunk in batch(references, batch_size = 2048):
    references_batch = spectra_to_contiguous_array(references_chunk)

    # Optimal batch size is hardware dependent - best values are
    # usually between 2048 - 8192. Always use powers of two!
    for queries_chunk in batch(queries, batch_size = 2048):
        queries_batch = spectra_to_contiguous_array(queries_chunk)

        # We have to pre-allocate outputs for GPU to write in
        batch_results = empty_array(3, 2048, 2048)
        
        # Invoke GPU code (Algo 1)
        kernel(references_batch, queries_batch, batch_results)

        # Save to disk (necessary if the results are too large for RAM)
        batch_results.save_to_disk()
```

This is a simplified version of what is really happening. In an actual code, the recomputation of inner-loop's batches doesn't happen, for example. 

This way, even if we have have `500_000` references and same amount of queries, we can still manage the memory load. In fact, on an RTX4090, it is possible to run `(500k)^2` comparisons within an hour or so (more on that later see `Results and Benchmarks` section below).

![ Grid layout ](/assets/img/cosine_greedy/cosine-batch-layout-grid.jpg)

![ Batch layout ](/assets/img/cosine_greedy/cosine-batch-layout-batch.jpg)

![ Thread layout ](/assets/img/cosine_greedy/cosine-batch-layout-thread.jpg)

## Results and Benchmarks

The `numba.cuda` implementation of the greedy cosine algorithm can run the required 100_000 x 1_500_000 pairwise comparisons in 3-4hrs, using the default parameters in the notebook (`tolerance = 0.1, num_matches=1024, mz_pow = 1, int_pow = 0`).

## Experiments

## Python + joblib

### OpenMP and C++

### Tensorflow






The particular company that was interested in this new CUDA kernel, is using mass-spectrometry equipment to scan a very large number of biological materials 
and then is using a particular similarity function, called [CosineGreedy](https://matchms.readthedocs.io/en/latest/_modules/matchms/similarity/CosineGreedy.html#CosineGreedy). `CosineGreedy` takes in two measurements and outputs values from 0% to 100%, former is means that inputs are completely different chemicals, and latter means that chemicals are identical. Usually, getting a similarity measure above 75% means you've found an extremely similar chemical. Getting similarity information for large-enough chemical reference datasets will result in invaluable insights into the composition of the scanned bio-materials.

Unfortunately, the `CosineGreedy` has a few quirks about it that make it impossible to use existing CUDA kernels to calculate it efficiently. And, it's default implementation in python, even with `numba.njit` on an 8-core CPU machine will take days to complete. 

## Problem setup
In field of mass-spectrometry, the end-result of spectroscopy is a pair of typically large float arrays - called `mz` and `int`.  The former 