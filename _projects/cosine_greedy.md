---
layout: page
title: Giga-scale chemical similarity calculations with CUDA
description: Mass-spectrometry results hundreds of thousands of m/z spectra. How do we compare these with 1.5mln reference spectra?
img: https://storage.googleapis.com/tornikeo-portfolio-cdn/cuda_cube.jpg
importance: 1
category: large projects
---

In this post, I'll discuss how, given the abundance of existing CUDA kernels, I created a new kernel for calculating a pairwise similarity between two large datasets of chemical spectra. 

## Introduction

The particular company that was interested in this new CUDA kernel, is using mass-spectrometry equipment to scan a very large number of biological materials 
and then is using a particular similarity function, called [CosineGreedy](https://matchms.readthedocs.io/en/latest/_modules/matchms/similarity/CosineGreedy.html#CosineGreedy). `CosineGreedy` takes in two measurements and outputs values from 0% to 100%, former is means that inputs are completely different chemicals, and latter means that chemicals are identical. Usually, getting a similarity measure above 75% means you've found an extremely similar chemical. Getting similarity information for large-enough chemical reference datasets will result in invaluable insights into the composition of the scanned bio-materials.

Unfortunately, the `CosineGreedy` has a few quirks about it that make it impossible to use existing CUDA kernels to calculate it efficiently. And, it's default implementation in python, even with `numba.njit` on an 8-core CPU machine will take days to complete. 

## Problem setup
In field of mass-spectrometry, the end-result of spectroscopy is a pair of typically large float arrays - called `mz` and `int`.  The former 