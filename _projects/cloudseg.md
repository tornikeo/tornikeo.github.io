---
layout: page
title: 3D mesh segmentation
description: Analyze and partition indoor 3D spaces into 200 different classes, using transformers!
video: https://i.imgur.com/TV10o0g.mp4
importance: 5
category: work
---

Point-cloud segmentation, or "cloudseg" for short, was one of the more challenging projects at Luxolis. The idea was relatively simple though. 

You are given a colored 3D mesh reconstruction of an indoor space (e.g. a living room). You are to assign each vertex the following labels: class label, instance label, and part label. 

Let's get to the example of a living room. The first stage - class label - assigns each vertex (a point in space), one of the predetermined classes (wall, floor, ceiling, chair, etc.). The second stage is actually determining which two points sharing the same *class*, actually are two different *objects*. 

<div class="row mt-3" style="justify-content:center;">
    <div class="col" >
        {% include figure.html path="https://i.imgur.com/5ArYydI.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption" >
    Various stages of the Mask3D segmentation. Notice that on the right-hand panel the two instances of the same class ("sofa") are separated.
</div>


<div class="row mt-3" style="justify-content:center;">
    <div class="col" >
        {% include image_comparison.html src_before="https://i.imgur.com/BlWeOP8.jpg" label_before="SoftGroup segmentation" src_after="https://i.imgur.com/vdXtHTB.jpg" label_after="Mask3D segmentation" %}
    </div>
</div>
<div class="caption" >
    Mask3D segmentation is much more robust than the current state-of-the-art (Softgroup)
</div>


<div class="row mt-3" style="justify-content:center;">
    <div class="col" >
        <iframe width="100%" height="315" src="https://www.youtube-nocookie.com/embed/jeo4xKYwoGc" title="YouTube video player" frameborder="0" allow="autoplay; picture-in-picture" allowfullscreen></iframe>
    </div>
</div>
<div class="caption" >
    A small, investor-focused showcase of Mask3D in action (Segment a small living room)
</div>

Work-in-progress: enjoy the illustrations, the full description is coming soon...