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

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/jeo4xKYwoGc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Work-in-progress: enjoy the illustrations, the full description is coming soon...