---
layout: post
title: "You should learn GPU programming"
description: Now is the best time to learn programming GPUs
categories: essay
---

**You should learn GPU programming.** Whether it's Numba CUDA, CUDA C++, or CuPy, understanding how and when to use GPUs will make you a better software engineer.

I claim that the current generation of AI GPUs will soon become obsolete. This could happen after the AI bubble bursts, or perhaps once consumer hardware becomes capable of running GPT-4o-level large language models (LLMs).

The most interesting scientific algorithms are often those that are too computationally expensive to use. They are interesting precisely because most researchers can't afford to run them. Sometimes, these algorithms "fit" well on an AI-oriented GPU, like an H100. When an algorithm fits on a GPU, it can become 100x or even 1000x faster compared to running on a CPU. A single GPU can then produce results comparable to those of a university supercomputer—or even several. When this happens, the algorithm becomes more accessible, opening the gates for others.

Right now is the best time to learn GPU programming. Take an intractable-but-useful scientific algorithm and rewrite it for the GPU. Write a paper about your process. Publish it. As GPU hardware advances, your reimplementation will become the most accessible gateway to computation for researchers.
