---
layout: post
title: "You should learn GPU programming"
description: Now is the best time to learn programming GPUs
---

It is a good time to learn GPU programming, and I'm here to convince you to do just that. Here's why you should do it.

GPUs are a widely available hardware that fits some computational problems just perfectly. AI happens to be one of these. Knowning how to program GPUs, and knowing what GPUs can and can not do will add a nice engineering tool to your belt. Not all problems can be solved on GPUs, but at times it can get you that [x1700 speedup](https://github.com/PangeAI/simms).

GPUs get outdated quickly, but remain powerful compared to even newer CPUs. This means that any software written for GPUs **appreciates** over time. Here's a concrete example:

![](https://github.com/tornikeo/cdn/raw/aa05823bb26d8ab0cf4f04a5608316be33e1f74f/assets/thesis/gpu_vs_cpu_scaling.png)

Same computational task, when solved with newer and newer GPUs get exponentially larger and larger speedups. 

The most interesting scientific algorithms are often those that are too computationally expensive to use. They are interesting precisely because most researchers can't afford to run them. Sometimes, these algorithms "fit" well on an AI-oriented GPU, like an H100. When an algorithm fits on a GPU, it can become 100x or even 1000x faster compared to running on a CPU. A single GPU can then produce results comparable to those of a university supercomputer—or even several. When this happens, the algorithm becomes more accessible, opening the gates for others.

Right now is the best time to learn GPU programming. Take an intractable-but-useful scientific algorithm and rewrite it for the GPU. Write a paper about your process. Publish it. As GPU hardware advances, your reimplementation will become the most accessible gateway to computation for researchers.
