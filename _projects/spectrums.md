---
layout: page
title: "SpectruMS: Foundation Model for Mass Spectrometry"
description: AI model for mass spectrometry data.
img: https://raw.githubusercontent.com/tornikeo/cdn/master/assets/spectrums/spectrums-thumb.svg
importance: 1
category: large projects
---

AI training is similar to file compression (think `.zip`). Both tools make large files smaller. The added benefit of AI that it makes the compressed information more easily searchable. The downside is that training AI is nothing like right clicking and `archive`-ing a folder.

[SpectruMS](https://github.com/tornikeo/cdn/raw/master/assets/spectrums/iccs_presentation.pdf) is an large language model Pagea Bio that is a **compressed** [GNPS](https://gnps.ucsd.edu/), [Massbank](https://massbank.eu/), [PubChem](https://pubchem.ncbi.nlm.nih.gov/) into a single AI model. SpectruMS compressed petabytes of chemical data into a single 5GB [BART](https://huggingface.co/docs/transformers/en/model_doc/bart) model:

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/spectrums/spectrums-squish.svg)

At [Pangea Bio](https://www.pangeabio.com/), I worked on SpectruMS from the very start. From data curation, to AI training, to babysitting the [TPU](https://en.wikipedia.org/wiki/Tensor_Processing_Unit), to deployment and serving on AWS. What follows is my personal day-to-day experience dealing with such projects and recommendations on approaching this.

## Define metrics early

Really. Define your metrics on day one, and implement on day two. For instance, our metric was a `Top-5 accuracy`. Don't be like me: we wasted an entire week before we implemented this. 

When a metric appears, it should come with two things:

- Evaluation dataset
- Baseline model(s)

Baseline models are give a sense of what the laziest, solution could look like. If you can make a random model with a `Top-5 accuracy` of 5%, then actually training a model to with 6% of `Top-5 accuracy` is not that impressive. You have a bug somewhere in training.

Second is the Evaluation dataset. Only two things matter for evaluation dataset: 
- AI in training never sees the evaluation dataset.
- Evaluation dataset is *really* different from training dataset.

## Settle for the laziest training approach

What is the laziest training approach you ask? It's the one that trains an LLM over a natural language. I'm serious: this is what worked *surprisingly* well at Pangea Bio, and it is utterly lazy because there's a [ton of](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_mlm.py) [ready-to-use](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_clm.py) [scripts](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_fim.py) that train an LLM on every concievable hardware - GPUs, TPUs, XPUs, you name it.

But weren't we training a foundation model for mass spectrometry? Indeed! But we reframed this mass spectrometry training goal into a language modelling problem. And it worked surprisingly well. Let me explain:

I reframed the problem of predicting `mass spectra -> chemical` into a [question-answering problem](https://huggingface.co/docs/transformers/en/tasks/question_answering). Basically, both the `mass spectra` and the `chemical` were turned into long texts, and for each `mass spectra` as input, the model was trained to output the `chemical` as a deepSMILES as text.

Why does this make sense? Because develing your own training pipeline and making it efficient is a lot of effert (weeks, month even). And it makes a lot of sense to lean onto the existing tools. If you can reframe your AI project problem as a language modelling problem, you will save yourself *weeks* of development time. And this is exactly what I did at Pangea. 

We reframed the training into [fine-tuning for question-answering](https://huggingface.co/learn/llm-course/en/chapter7/7) tutorial. And we reframed the BART pretraining to a [masked language modelling](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_mlm.py) over a corpus of strigified MS/MS data and chemical deepSMILES. 

We chose a [BART](https://huggingface.co/docs/transformers/en/model_doc/bart) model architecture for this task instead of a [GPT](https://huggingface.co/docs/transformers/en/model_doc/openai-gpt), even though (I think) GPT would've been more efficient. In the end, what matters most is the quality and amount of data and not the model architecture. More on that later.

In essence, our model is this kind of function:

```py
def model(msms_string: str) -> str:
  msms_tokens = tokenizer(msms_string)
  prediction = tokenizer('<|begin_chemical|>')
  while True:
    next_token += model(msms_tokens, prediction)
    if next_token == '<|end_chemical|>'
      break
    prediction += next_token
  return prediction
```

To get the `Top-5 accuracy`, simply sampled the model with nonzero temperature and it gave us (sometimes) random outputs. If the correct string is within the first 5 tries, that's a +1 score.

## TPU training sucks

Google is an amazing company that specializes in creating amazingly convoluted tools. TPU is a Google's chip for training AI, but using a TPU has to be one of the most painful experiences an AI engineer can be subjected to. The second biggest problem with TPUs is just how expensive they are to use. This is what my team manager had to say about why they abandoned TPUs (even though Google offered them literally for free, with ~$100k in cloud credits):

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/spectrums/on-tpus.png)

TPUs are slow to start, the errors are (if you can even access the logs) cryptic, and software written for TPU training is useless for training on GPUs. Additionally