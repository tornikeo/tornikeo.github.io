---
layout: page
title: VIMAGE - Accelerate, Simplify, Deploy
description: Dev story of building a scalable GPU-backed solution on google cloud platform
video: https://i.imgur.com/mem0FPB.mp4
category: work
---
<video loop="loop" autoplay="" playsinline="" muted="" id="mejs_6833802707345928_html5" preload="none" src="https://storage.cloud.google.com/tornikeo-portfolio-cdn/website_diffloop.mp4" style="margin: 0px; width: 100%; height: 500px;">
				<source type="video/mp4" src="https://storage.cloud.google.com/tornikeo-portfolio-cdn/website_diffloop.mp4">				
</video>

[VIMAGE](https://play.google.com/store/apps/details?id=com.vimage.android&hl=en&gl=US) is an award-winning photo-editing software, with over **10 million** total downloads on google play. It is primarily built by a group of just 5 people (as of March 6, 2023). An overview of the app's capabilities is shown in this promotional video:


<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/whD3l0YXIEU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


The results look nice and, if you have a keen eye for the ML tech, you will have noticed that the core of the project's success rests on decomposing the image into fore- and background parts, to allow for seamless modification of both parts.

## Details and requirements

The core of the project consists of the following three parts:
- Handling image I/O in a way that respects the end-user privacy
- Creating an accurate depth map of the input RGB image.  
- Deciding which pixels fall within the background and which within the foreground

<div class="row">
    <div class="col" >
        {% include image_comparison.html style="width: 500px;" src_before="https://i.imgur.com/4r6AxEC.png" label_before="Depth map" src_after="https://i.imgur.com/Z78wJUV.png" label_after="Raw image" %}
    </div>
</div>
<div class="caption" >
    Creating an accurate depth map from an RGB image is a very important step in background separation
</div>

In addition, there were additional, purely business-driven restrictions in place:
- Prioritize cost saving
- Ensure the app can scale up smoothly
- Optimize code, reduce end-user lag
- Everything should be hosted on [google cloud platform](https://console.cloud.google.com/)


## Implementation
Coming soon...


<video loop="loop" autoplay="" playsinline="" muted="" width="100" id="mejs_07104913812086666_html5" preload="none" src="https://vimageapp.com/wp-content/uploads/2019/08/hero-comp.mp4" style="margin: 0px; width: 100%; height: 500px;">
				<source type="video/mp4" src="https://vimageapp.com/wp-content/uploads/2019/08/hero-comp.mp4">		
</video>
