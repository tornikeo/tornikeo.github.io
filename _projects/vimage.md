---
layout: page
title: "VIMAGE: Accelerate, Simplify, Deploy"
description: Scalable GPU-backed solution on Google Cloud.
video: https://raw.githubusercontent.com/tornikeo/cdn/master/assets/vimage/diffloop-thumb.webm
importance: 4
category: large projects
---

<figure>
  <div class="row" class="center-role-form">
    <div class="col">
      <video loop="loop" autoplay playsinline muted id="mejs_6833802707345928_html5" preload="none" src="https://raw.githubusercontent.com/tornikeo/cdn/master/assets/vimage/diffloop-cropped-tiny.webm" style="margin: 0px; width: 100%; height: 100%;">
      </video>
    </div>
  </div>
</figure>

[VIMAGE](https://play.google.com/store/apps/details?id=com.vimage.android&hl=en&gl=US) is an early image-to-video AI application, with over **10 million** total downloads on Google Play. It is primarily built by a group of just 5 people (as of March 6, 2023). An overview of the app's capabilities is shown in this promotional video:

<figure>
    <div class="col">
        <iframe width="100%" height="400px" src="https://www.youtube-nocookie.com/embed/whD3l0YXIEU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
  <figcaption class="caption">
    Promotional video from <a href="https://play.google.com/store/apps/details?id=com.vimage.android&hl=en&gl=US">VIMAGE</a>, highlighting the main features of the app. 
  </figcaption>
</figure>

The app works by decomposing an uploaded image into two parts: foreground and background, and manipulating the two parts to add effects like a parallax. Even though the technology behind this is simple, the results (as seen above) look quite impressive.

## Project Requirements

The core of the project consists of the following three parts:
- Handling image I/O in a way that respects end-user privacy
- Creating an accurate depth map of the input RGB image  
- Deciding which pixels fall within the background and which within the foreground

<div class="row">
    <div class="col" >
        {% include image_comparison.html style="width: 500px;" src_before="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/4r6AxEC.png" label_before="Depth map" src_after="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/Z78wJUV.png" label_after="Raw image" %}
    </div>
</div>
<div class="caption" >
    Creating an accurate depth map from an RGB image is a very important step in background separation.
</div>

In addition, there were other business restrictions in place:

- Prioritize cost saving
- Ensure scalability - the app had frequent usage spikes
- Make the app faster
- Add basic Firebase authentication
- Host all of it on Google Cloud Platform to make use of credits

## Implementation

The most pressing constraint of this project was the GPU requirements of the core layer of the project. This, coupled with the scalability requirements (i.e., a fully managed GPU provider platform), narrowed down our choice of compute providers significantly. At this stage, we had just three options:

- Set up a manual lightweight server that allocates and deallocates GPU-powered VMs from `Google Cloud Compute` service.
- Investigate the `Google Cloud Run Anthos` service (which reportedly provides serverless GPUs).
- Investigate whether `Google Cloud Vertex AI` could be used for our requirements.

To avoid a costly research phase, we consulted with a certified Google Cloud architect and, with their insight, decided to go with the `Vertex AI` service. The rough outline of the project was specified during a packed one-hour-long meeting:

- Use `Vertex AI Endpoint` to access the cheapest GPU VM (T4 GPU instance backed with N2-family CPU).
- Leverage the scalability of `Vertex AI Endpoints`. VAIE is scalable by default but is constrained to have **at least one instance always running**. Usually, this means a monthly bill of around $300, and for personal, ultra-low-use projects, this kind of bill is a big no-no. However, given our customer's access to a large amount of budget, this price was of no concern.

However, VAIE also comes with a few drawbacks. Namely:
- All the requests must be [smaller than 1.5 MB in size](https://cloud.google.com/vertex-ai/docs/predictions/custom-container-requirements#request_requirements).
- [All requests have to be in plain JSON](https://cloud.google.com/vertex-ai/docs/predictions/custom-container-requirements#request_requirements).
- [The container has to be hosted on `Google Cloud Containers` service](https://cloud.google.com/vertex-ai/docs/predictions/custom-container-requirements#publishing).

## Reflections

The VIMAGE project was the first large-scale project I worked on that had active users from day one. The application backend profiling, bottleneck identification, and optimizations were the easiest parts to complete. Basic security and authentication, to my surprise, were even easier to add. The most time-consuming part was babysitting the Vertex AI deployments. I find it mind-boggling just how suboptimal the backend implementation was as it was presented to me. I think with this project I've learned a very valuable lesson in designing successful applications: make it work first, and you can make it optimal later.