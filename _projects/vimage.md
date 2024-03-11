---
layout: page
title: VIMAGE - Accelerate, Simplify, Deploy
description: Dev story of building a scalable GPU-backed solution on google cloud platform
video: https://storage.googleapis.com/tornikeo-portfolio-cdn/vimage-promo.webm
importance: 4
category: large projects
---

<figure>
    <div class="row" class="center-role-form">
        <div class="col">
            <video loop="loop" autoplay="" playsinline="" muted="" id="mejs_6833802707345928_html5" preload="none" src="https://storage.googleapis.com/tornikeo-portfolio-cdn/website_diffloop.mp4" style="margin: 0px; width: 100%; height: 100%;">
            </video>
        </div>
        <div class="col">
            <iframe width="100%" height="400px" src="https://www.youtube-nocookie.com/embed/whD3l0YXIEU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
    </div>
    <figcaption class="caption">
        Promotional video from <a href="https://play.google.com/store/apps/details?id=com.vimage.android&hl=en&gl=US">VIMAGE</a>, highlighting the main features of the app. 
    </figcaption>
</figure>

[VIMAGE](https://play.google.com/store/apps/details?id=com.vimage.android&hl=en&gl=US) is an award-winning photo-editing software, with over **10 million** total downloads on google play. It is primarily built by a group of just 5 people (as of March 6, 2023). An overview of the app's capabilities is shown in this promotional video:



The results look nice and, if you have a keen eye for the ML tech, you will have noticed that the core of the project's success rests on decomposing the image into fore- and background parts, to allow for seamless modification of both parts.

## Details and requirements

The core of the project consists of the following three parts:
- Handling image I/O in a way that respects the end-user privacy
- Creating an accurate depth map of the input RGB image.  
- Deciding which pixels fall within the background and which within the foreground

<div class="row">
    <div class="col" >
        {% include image_comparison.html style="width: 500px;" src_before="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/4r6AxEC.png" label_before="Depth map" src_after="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/Z78wJUV.png" label_after="Raw image" %}
    </div>
</div>
<div class="caption" >
    Creating an accurate depth map from an RGB image is a very important step in background separation
</div>

In addition, there were other, purely business-driven restrictions in place:
- Prioritize cost saving
- Ensure the app can scale up smoothly
- Optimize code, reduce end-user lag
- Everything should be hosted on [google cloud platform](https://console.cloud.google.com/)

## Live showcase

### Depth estimation

{% include iframe_with_spinner.html src="https://radames-dpt-depth-estimation-3d-voxels.hf.space" height="1050px" %}

### Background removal

Below you can see the background removal tool in action. It is **free to use**:

<iframe
	src="https://eccv2022-dis-background-removal.hf.space"
	frameborder="0"
	width="100%"
	height="450"
></iframe>

## Implementation

The most pressing constraint of this project was the GPU-requirements of the core layer of the project. This, coupled with the scalability requirements (i.e. a fully managed GPU provider platform) narrowed down our choice of compute providers significantly. At this stage we had just 3 options:

- Set up a manual lightweight server that allocates and de-allocates GPU-powered VMs from `google cloud compute` service.
- Investigate the `google cloud run anthos` service (which, reportedly provides serverless GPUs)
- Investigate whether `Google Cloud Vertex AI` could be used for our requirements.

To avoid costly research phase, we consulted with a certified google cloud architect and with their insight, decided to go with `Vertex AI` service. The rough outline of the project was specified during a packed 1 hour-long meeting:

- Use `Vertex AI Endpoint` to access the cheapest GPU VM (T4 GPU instance backed with N2-family CPU).
- Leverage the scalability of `Vertex AI Endpoints`. VAIE is scalable by default, but is constrained to have **at least 1 instance always running**. Usually, this means a monthly bill of around $300, and for personal, ultra-low-use projects, this kind of bill is a big no-no. However, given our customer's access to a large amount of budget, this price was of no concern.

However, VAIE also comes with a few drawbacks. Namely:
- All the requests must be [smaller than 1.5mb in size](https://cloud.google.com/vertex-ai/docs/predictions/custom-container-requirements#request_requirements)
- [All requests have to be in plain JSON](https://cloud.google.com/vertex-ai/docs/predictions/custom-container-requirements#request_requirements)
- [The container has to be hosted on `google cloud containers` service](https://cloud.google.com/vertex-ai/docs/predictions/custom-container-requirements#publishing)

<video loop="loop" autoplay="" playsinline="" muted="" width="100" id="mejs_07104913812086666_html5" preload="none" src="https://vimageapp.com/wp-content/uploads/2019/08/hero-comp.mp4" style="margin: 0px; width: 100%; height: 500px;">
				<source type="video/mp4" src="https://vimageapp.com/wp-content/uploads/2019/08/hero-comp.mp4">		
</video>
