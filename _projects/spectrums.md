---
layout: page
title: "SpectruMS: Foundation Model for Mass Spectrometry"
description: AI model for mass spectrometry data.
img: https://raw.githubusercontent.com/tornikeo/cdn/master/assets/spectrums/spectrums-thumb.svg
importance: 1
category: large projects
---

AI training is similar to file compression (think `.zip`). Both tools make large files smaller. The added benefit of AI is that it makes the compressed information more easily searchable. The downside is that training AI is nothing like right clicking and `archive`-ing a folder.

[SpectruMS](https://github.com/tornikeo/cdn/raw/master/assets/spectrums/iccs_presentation.pdf) was a large language model at Pangea Bio that **compressed** [GNPS](https://gnps.ucsd.edu/), [Massbank](https://massbank.eu/), [PubChem](https://pubchem.ncbi.nlm.nih.gov/) into a single AI model. SpectruMS compressed petabytes of chemical data into a single 5GB [BART](https://huggingface.co/docs/transformers/en/model_doc/bart) model:

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/spectrums/spectrums-squish.svg)

At [Pangea Bio](https://www.pangeabio.com/), SpectruMS was developed essentially from scratch. Every step, data curation, AI training, babysitting the [TPU](https://en.wikipedia.org/wiki/Tensor_Processing_Unit), deployment and serving on AWS was done in-house. What follows is my day-to-day experience of dealing with this project and my recommendations on approaching this.

## Define metrics early

Really. Metrics should be defined on day one, and implemented on day two. For instance, the metric was `Top-5 accuracy`. An entire week was wasted before this was implemented. 

When a metric appears, it should come with two things:

- Evaluation dataset
- Baseline model(s)

Baseline models give a sense of what the laziest solution could look like. If a random model can be made with a `Top-5 accuracy` of 5%, then actually training a model with 6% `Top-5 accuracy` is not that impressive. There's a bug somewhere in training.

Second is the evaluation dataset. Only two things matter for evaluation dataset: 
- AI in training never sees the evaluation dataset.
- Evaluation dataset is *really* different from training dataset.

## Settle for the laziest training approach

What is the laziest training approach? It's the one that trains an LLM over natural language. This was what worked *surprisingly* well in practice, and it was utterly lazy because there's a [ton of](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_mlm.py) [ready-to-use](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_clm.py) [scripts](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_fim.py) that train an LLM on every conceivable hardware - GPUs, TPUs, XPUs, you name it.

But wasn't this about training a foundation model for mass spectrometry? Indeed! But this mass spectrometry training goal was reframed into a language modelling problem. And it worked surprisingly well. Let me explain:

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/spectrums-lazy.svg)

The problem of predicting `mass spectra -> chemical` was reframed into a [question-answering problem](https://huggingface.co/docs/transformers/en/tasks/question_answering). Basically, both the `mass spectra` and the `chemical` were turned into long texts, and for each `mass spectra` as input, the model was trained to output the `chemical` as deepSMILES as text. A simple text-to-text model.

Why did this make sense? Because writing your own training pipeline and making it efficient is a lot of effort (weeks, months even) and a lot of wasted cash. And it makes a lot of sense to lean on the existing open-source tools. If the AI problem can be reframed as a language modelling problem, weeks of development time can be saved. And this was exactly what was done at Pangea. 

The training was reframed into basically the [fine-tuning for question-answering](https://huggingface.co/learn/llm-course/en/chapter7/7) tutorial. And the [BART](https://huggingface.co/docs/transformers/en/model_doc/bart) [masked language modelling](https://github.com/huggingface/transformers/blob/main/examples/pytorch/language-modeling/run_mlm.py) pretraining over a corpus of stringified MS/MS data and chemical deepSMILES was done. 

A BART model architecture was chosen for this task instead of a [GPT](https://huggingface.co/docs/transformers/en/model_doc/openai-gpt), even though GPT would've been (in my opinion) more efficient and easier. In the end, what mattered most was the quality and amount of data and not the model architecture. More on that later.

In essence, the inference looked like this function:

```py
def predict(msms_string: str) -> str:
  msms_tokens = tokenizer(msms_string)
  prediction = tokenizer('<|begin_chemical|>')
  while True:
    next_token += model(msms_tokens, prediction)
    if next_token == '<|end_chemical|>':
      break
    prediction += next_token
  return prediction
```

To get the `Top-5 accuracy`, the model was simply sampled with nonzero temperature to create random outputs. If the exact correct string was within the first 5 tries, that was a +1 score.

## TPU training sucks

Google is an amazing company that specializes in creating amazingly convoluted tools. TPU is Google's chip for training AI, but using a TPU had to be one of the most painful experiences an AI engineer could be subjected to. The second biggest problem with TPUs was just how expensive they were to use. 

TPUs were slow to start, the errors were (if logs could even be accessed) cryptic, and software written for TPU training was useless for training on anything *but* Google's TPUs. 

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/spectrums-tpus.svg)

The TPU situation was so bad that even though the team was offered some $100k in Google cloud credits, the team lead still decided to move away from using TPUs. Even the fine-tuning part for question-answering (read: question-in-ms/ms answer in deepSMILES) was done away from TPUs and on an A100 instance on Google Cloud.

## It is easy to burn a lot of cash

And not only on GPUs or TPUs, mind you. When working with a lot of data (there was a petabyte or so of it), it was easy to accidentally burn a lot of cash with a single press of a button. Taking your money out of the bank, covering it with gasoline and setting it on fire would be slower. Like, it would take more effort per dollar to destroy your money than that.

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/aws-burning.svg)

In one accident, $2.5k went aflame on AWS, because of S3. Essentially, a lot of data was written into an S3 Glacier Deep Archive storage. During data processing, one of the workflows accidentally read a large portion of that data. On S3 Glacier, the pricing was not for storage but per GB read. The workflow read $2.5k worth of data. The billing for that day looked like a Dirac function:

![](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/cosine_greedy/aws-burning(1).svg)

Ouch. 

## Conclusion

Training the foundation model for Pangea Bio was one of the best achievements in 2024. A large language model was trained for Pangea Bio to help narrow down the identity of mass spectra (answering the question "what chemical made this spectrum?"). This problem was reformulated into well-known language modelling tasks and training logic was built around this. This new weird model easily smashed the previous internal metric for model performance and in this process much was learned. That kind of experience is going to stay very valuable precisely because of how many resources it demanded. If working at Pangea Bio is being considered, it is wholeheartedly recommended -- [reach out on LinkedIn](https://www.linkedin.com/in/tornikeo/) if there are any questions.