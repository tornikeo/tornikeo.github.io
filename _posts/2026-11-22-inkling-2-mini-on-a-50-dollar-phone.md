---
layout: post
title: "A $50 phone can run a 26-billion-parameter model"
description: "I ran Inkling 2 Mini offline on a used Redmi I bought for $46. Here’s the recording, how fast it ran, and how much RAM it took."
permalink: /inkling-2-mini-on-a-50-dollar-phone/
---

A used [Redmi](https://www.mi.com/global/product/redmi-note-13-pro/) bought at a thrift shop for 46 US dollars can run Inkling 2 Mini, the new looping transformer with 26 billion parameters [released by Thinking Machines Lab](https://thinkingmachines.ai/news/inkling-2-mini/). Below I share how I did this and some surprising results.

The [Redmi Note 13 Pro 4G](https://www.mi.com/global/event/2024/redmi-note-13-series-product-launch/) was released in 2024 and has 12 GB of RAM and 512 GB of disk space. For the model, I used a quantized version of Inkling, specifically [AtomicChat’s AD-IQ1_S quant](https://huggingface.co/AtomicChat/Inkling-2-Mini-GGUF), which is 6.88 GB as a file.

I connected my phone via USB to a Linux machine. My phone runs Android. I asked my Codex to find the smallest quantized model for Inkling and to load it onto the phone.

The phone has 8 CPU cores. I ran Inkling on the phone itself using llama.cpp with 6 threads and the ARMv8.2 CPU backend.

This is what it looks like to run Inkling on an old phone like this.

<figure class="text-center">
  <video controls playsinline preload="metadata" width="720" height="1600"
         style="display: block; width: auto; height: auto; max-width: 100%; max-height: 75vh; margin: 0 auto;"
         aria-label="Uncut two-turn conversation recorded on the Redmi in airplane mode"
         poster="/assets/media/inkling-2-mini-on-a-50-dollar-phone/chat-poster.jpg">
    <source src="/assets/media/inkling-2-mini-on-a-50-dollar-phone/chat.mp4" type="video/mp4">
    <a href="/assets/media/inkling-2-mini-on-a-50-dollar-phone/chat.mp4">Watch the chat recording</a>
  </video>
  <figcaption class="caption">Real-time Android screen recording · 3 minutes · no audio</figcaption>
</figure>

Prefill, which means the AI is reading the text, is quite slow at about 17.3 seconds for the first prompt, which means 2.08 tokens per second for prefill. And generation peaks at around 0.78 tokens per second in the recording. My guess is that two to three times this speed would be possible on hardware like this.

The phone’s surface temperature was 39.9°C as I started entering the first question. It peaked at 46.7°C and was down to 43.3°C by the end of the recording. What is also interesting is how much context can be saved on the device currently. Inkling supports a [one-million-token context window](https://huggingface.co/thinkingmachines/Inkling-2-Mini/blob/main/config.json). However, with the current setup, filling up all one million tokens would cost around 41.5 GB for the model and its context, which is more RAM than this 12 GB phone has.

I think this is fascinating. Running a 26-billion-parameter AI model was, just a few months ago, an unthinkable achievement. I still remember fiddling with Hugging Face quants and trying to fit diffusion models into my 8 GB of GPU memory. And right now, being able to run models like this on small hardware feels like an exponential improvement. The time when we ditch closed-source models for private, local, and fast AI cannot come soon enough. Intelligence must be free and freely available.
