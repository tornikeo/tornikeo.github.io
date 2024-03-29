---
layout: page
title: Stable diffusion in serverless mode
description: AI apps require renting an expensive GPU server. Serverless GPUs can provide a cheap alternative!
video: https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/07ylZV6.mp4
importance: 3
category: personal
---

# Intro on stable diffusion

Stable Diffusion is a latent text-to-image diffusion model capable of generating photo-realistic images given almost *any* text input. Have a look at have a look at [🤗's Stable Diffusion with Diffusers blog](https://huggingface.co/blog/stable_diffusion) for information about how Stable Diffusion functions. Here, however, we will learn more about how to host `Stable-Diffusion-v1-4` on a *serverless* GPU backend.

The Stable-Diffusion-v1-4 checkpoint was initialized with the weights of the Stable-Diffusion-v1-2 checkpoint and subsequently fine-tuned on 225k steps at resolution 512x512 on "laion-aesthetics v2 5+" and 10% dropping of the text-conditioning to improve classifier-free guidance sampling.

{% include video.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/07ylZV6.mp4" caption="images generated by the stable diffusion library" width="70%" %}

# A live showcase
Below, you will see a sample *free* implementation of stable diffusion model, deployed on a serverless GPU backend. **Note that it might take up to 10-15 seconds to load**. While the boot-up delay can be frustrating, where it is tolerable, server cost savings can be huge. This is especially important for showcase projects and services with occasional demand spikes every now and then. 

Try out the serverless diffusion - it's *nearly* free. *Nearly*, because each invocation takes around 15-20 seconds to finish, and, each *second* costs around $0.00025996.  **Click the below image to open up the website for it (requires google auth, since it still costs a bit of money to run).**

<a href="https://tornikeo.web.app/login">
    <img src="https://storage.googleapis.com/tornikeo-portfolio-cdn/Screenshot%20from%202023-03-23%2001-14-02.png">
</a>

## How it works

This app is composed of three major layers (all freely available): 
- All you see here, at [https://tornikeo.github.io/](https://tornikeo.github.io/) is delivered as a static website, from github pages. This is just plain old HTML, CSS and JavaScript. No magic here. This part of the app can be called a *front*. It is hosted by github and is extremely quick to load. 
- The box above this text, which contains the **submit** button and other controls, is actually a separate website. It is hosted as a serverless, python application on google cloud server. It is serverless, because the server it runs on is only up when someone is actively using it. It also acts as a sort of a gateway. It can limit the number of requests you make from the *front* or block users based on IP, something that is not possible by just relying on HTML and JavaScript. Let's call this part a *gateway*.
- Lastly, and this is the important bit, the *gateway* calls a hidden website, with two secret strings, **MODEL_KEY** and **API_KEY**. We call this the *backend*. This API is hosted by [banana.dev](https://www.banana.dev/). Currently *banana.dev* is the simplest serverless GPU provider on the market. When *gateway* calls *backend*, *banana.dev* boots up my container containing the stable diffusion model and executes the input given to *gateway* from the *front*. The result is then passed back, in two steps - *backend* to *gateway*, *gateway* to *front*.

And, this is it. Had I not used serverless GPU as a backend, I would've ended up with a monthly bill of around $300. Right now, it's less than $3 (in 2022), since my showcases don't have regular users. 
