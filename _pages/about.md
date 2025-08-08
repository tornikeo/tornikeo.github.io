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

I'm a generalist [AI researcher](https://scholar.google.com/citations?user=QnocfnMAAAAJ&hl=en) and [software engineer](https://github.com/tornikeo/), and I host my writing on tech and my past projects here. I've built a lot of tools for startups: [Search engine for chemicals](https://github.com/PangeAI/simms), [Robotic control for nanoflakes](https://github.com/tornikeo/atomic-architects), [AI video editor for Investigators](https://tornikeo.com/projects/investigation_ve/).

Shoot an email at `contact [@] tornikeo.com`, or talk to me on this [server](https://discord.gg/MuJxRh2dZG). I'm always interested in helping out people in tech. My areas of expertise:
- Cloud -- Google, Amazon, or Azure.
- Custom GPU and CUDA wizardry.
- AI models and LLMs (training and tuning, **not** prompting).

## selected projects

- I built and maintain the fastest exact [Cosine Similarity calculation tool](https://github.com/PangeAI/simms). It's a fairly simple and unoptimized CUDA kernel that calculates Mass spectrum [Cosine Similarity](https://matchms.readthedocs.io/en/latest/api/matchms.similarity.CosineGreedy.html) and [Modified Cosine Similarity](https://matchms.readthedocs.io/en/latest/api/matchms.similarity.ModifiedCosine.html) scores. The speedups come from the massive memory bandwidth that GPUs typically have. There's no shared memory used, and memory access patterns are less than ideal. I will optimize it at some point.
- I've designed an AI model for chemistry and mass spectrometry (MS) called [SpectruMS](https://github.com/tornikeo/cdn/raw/master/assets/spectrums/iccs_presentation.pdf). The paper will be announced soon.
- I built a [finite-difference time-domain simulation tool](https://github.com/tornikeo/optical_nand) for fully all-optical logical gates. These "optical gates" are made of a special glass that changes its refractive index $$n$$ as the power of the laser increases. This allows us to make a fully optical AND gate. The simulations also show how the all-powerful NAND gate can be built. All simulation codes are in MATLAB.