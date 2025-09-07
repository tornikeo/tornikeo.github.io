---
layout: page
title: "SpectruMS: new foundation model for mass spectrometry"
description: SpectruMS is the most ambitious, high-budget project involving custom LLM development and API deployment for analytical chemistry I've worked on to-date.
img: https://github.com/tornikeo/cdn/raw/master/assets/spectrums/spectrums-thumb.svg
importance: 1
category: large projects
---

AI training is similar to file compression (think `.zip`). Both tools make large files smaller. The added benefit of AI that it makes the compressed information more easily searchable.

[SpectruMS](https://github.com/tornikeo/cdn/raw/master/assets/spectrums/iccs_presentation.pdf) is an attempt of Pagea Bio to **compress** all of [GNPS](https://gnps.ucsd.edu/), [Massbank](https://massbank.eu/), [PubChem](https://pubchem.ncbi.nlm.nih.gov/) and more into a single AI model. SpectruMS compressed petabytes of chemical data into a single, small, [BART](https://huggingface.co/docs/transformers/en/model_doc/bart) model:

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/spectrums/spectrums-squish.svg)

I was there to design virtually every aspect of SpectruMS, from data curation, to AI training, to babysitting the [TPU](https://en.wikipedia.org/wiki/Tensor_Processing_Unit) pod to deployment and serving on AWS. 






