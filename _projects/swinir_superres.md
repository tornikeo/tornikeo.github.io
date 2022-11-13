---
layout: page
title: Image super-resolution (live showcase)
description: 4x your image in both dimensions, for free!
video: https://i.imgur.com/ahwKchR.mp4
importance: 3
category: work
---

# Intro on image super-resolution

Image restoration is a long-standing low-level vision problem that aims to restore high-quality images from low-quality images (e.g., downscaled, noisy and compressed images). While state-of-the-art image restoration methods are based on convolutional neural networks, few attempts have been made with Transformers which show impressive performance on high-level vision tasks. 
In this demo, I showcase a working online super-resolution tool, based on [SwinIR Transformer](https://github.com/JingyunLiang/SwinIR). SwinIR consists of three parts: shallow feature extraction, deep feature extraction and high-quality image reconstruction. In particular, the deep feature extraction module is composed of several residual Swin Transformer blocks (RSTB), each of which has several Swin Transformer layers together with a residual connection. We conduct experiments on three representative tasks: image super-resolution (including classical, lightweight and real-world image super-resolution), image denoising (including grayscale and color image denoising) and JPEG compression artifact reduction. Experimental results demonstrate that SwinIR outperforms state-of-the-art methods on different tasks by up to 0.14~0.45dB, while the total number of parameters can be reduced by up to 67%.

<div class="row" style="justify-content:center;">
    <div class="col" >
        {% include figure.html path="https://github.com/JingyunLiang/SwinIR/raw/main/figs/SwinIR_archi.png"%}
    </div>
</div>
<div class="caption" >
    The SwinIR architecture outline
</div>

# A live showcase
Below, you will see a sample *free* implementation of SwinIR super-resolution model, deployed on a serverless GPU backend. **Note that it might take up to 10-15 seconds to load**. While the boot-up delay can be frustrating, where it is tolerable, server cost savings can be huge. This is especially important for showcase projects and services with occasional demand spikes every now and then. 

{% include iframe_with_spinner.html src="https://backend-6uu265amkq-uc.a.run.app/serverless_superres/" height="1200" %}

## How it works

This app is composed of three major layers (all freely available): 
- All you see here, at [https://tornikeo.github.io/](https://tornikeo.github.io/) is delivered as a static website, from github pages. This is just plain old HTML, CSS and JavaScript. No magic here. This part of the app can be called a *front*. It is hosted by github and is extremely quick to load. 
- The box above this text, which contains the **submit** button and other controls, is actually a separate website. It is hosted as a serverless, python application on google cloud server. It is serverless, because the server it runs on is only up when someone is actively using it. It also acts as a sort of a gateway. It can limit the number of requests you make from the *front* or block users based on IP, something that is not possible by just relying on HTML and JavaScript. Let's call this part a *gateway*.
- Lastly, and this is the important bit, the *gateway* calls a hidden website, with two secret strings, **MODEL_KEY** and **API_KEY**. We call this the *backend*. This API is hosted by [banana.dev](https://www.banana.dev/). Currently *banana.dev* is the simplest serverless GPU provider on the market. When *gateway* calls *backend*, *banana.dev* boots up my container containing the stable diffusion model and executes the input given to *gateway* from the *front*. The result is then passed back, in two steps - *backend* to *gateway*, *gateway* to *front*.

And, this is it. Had I not used serverless GPU as a backend, I would've ended up with a monthly bill of around $300. Right now, it's less than $3 (in 2022), since my showcases don't have regular users. 
