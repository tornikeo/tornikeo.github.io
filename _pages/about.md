---
layout: about
title: about
permalink: /

profile:
  align: right
  image: profile.jpg

news: true  # includes a list of news items
selected_papers: true # includes a list of papers marked as "selected={true}"
social: true  # includes social icons at the bottom of the page
---

This website contains posts about some of my noteworthy projects, and my less noteworthy blogs.

Shoot me an email at `contact [@] tornikeo.com`, or even better, [hop on my ✨discord server✨](https://discord.gg/rd3MMJNQ) for a coffee chat! I'm always interested in helping out in tech. Common topics I work with:
- AI models and LLMs.
- Cloud -- Google, Amazon, or Azure.
- Custom GPU and CUDA wizardry.

## selected projects

- I've designed some of the key parts of an upcoming [MS/MS Foundation model, SpectruMS](https://github.com/tornikeo/cdn/raw/master/assets/spectrums/iccs_presentation.pdf). The paper is a work in progress.
- I built and maintain the fastest exact [Cosine Similarity calculation tool](https://github.com/PangeAI/simms). It's a fairly simple and unoptimized CUDA kernel that calculates Mass spectrum [Cosine Similarity](https://matchms.readthedocs.io/en/latest/api/matchms.similarity.CosineGreedy.html) and [Modified Cosine Similarity](https://matchms.readthedocs.io/en/latest/api/matchms.similarity.ModifiedCosine.html) scores. The speedups come from the massive memory bandwidth that GPUs typically have. There's no shared memory used, and memory access patterns are less than ideal. I will optimize it at some point.
- I built a [finite-difference time-domain simulation tool](https://github.com/tornikeo/optical_nand) for fully all-optical logical gates. These "optical gates" are made of a special glass that changes its refractive index $$n$$ as the power of the laser increases. This allows us to make a fully optical AND gate. The simulations also show how the all-powerful NAND gate can be built. All simulation codes are in MATLAB.