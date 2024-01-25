---
layout: page
title: 3D mesh segmentation
description: Analyze and partition indoor 3D spaces into 200 different classes, using transformers!
video: https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/TV10o0g.mp4
importance: 5
category: large projects
---

Point-cloud segmentation, or "cloudseg" for short, was one of the more challenging projects at Luxolis. The idea was relatively simple though. 

You are given a colored 3D mesh reconstruction of an indoor space (e.g. a living room). You are to assign each vertex the following labels: class label, instance label, and part label. 

Let's get to the example of a living room. The first stage - class label - assigns each vertex (a point in space), one of the predetermined classes (wall, floor, ceiling, chair, etc.). The second stage is actually determining which two points sharing the same *class*, actually are two different *objects*. 

<div class="row mt-3" style="justify-content:center;">
    <div class="col" >
        {% include figure.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/5ArYydI.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption" >
    Various stages of the Mask3D segmentation. Notice that on the right-hand panel the two instances of the same class ("sofa") are separated.
</div>


<div class="row mt-3" style="justify-content:center;">
    <div class="col" >
        {% include image_comparison.html src_before="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/BlWeOP8.jpg" label_before="SoftGroup segmentation" src_after="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/vdXtHTB.jpg" label_after="Mask3D segmentation" %}
    </div>
</div>
<div class="caption" >
    Mask3D segmentation is much more robust than the current state-of-the-art (Softgroup)
</div>


{% include yt_video.html src="https://www.youtube-nocookie.com/embed/jeo4xKYwoGc" caption="A small, investor-focused showcase of Mask3D segmentation (a small living room)" %}


<div class="row mt-3" style="justify-content:center;">
    <div class="col" >
        {% include figure.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/dGiiSdo.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    The core of the model - Sparse convnet (Minkowski engine) + Decoder transformer.
</div>


# A Live demo

Follow the instructions down below in order to generate 3D point cloud segmentation, works both indoors and outdoors. Make sure to use the supported 3D point cloud formats, and to orient the cloud correctly (z-axis points towards positive vertical direction). 

{% include iframe_with_spinner.html src="https://mix3d-demo.nekrasov.dev/mask3d/" height="1000" %}

