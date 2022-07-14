---
layout: post
title:  MLDev logs - day-to-day log
date: "2022-07-07 11:01:00"
description: Arguably honest logs while learning ML development
tags: Machine Learning, Development
categories: day-to-day
---


## 2022, Jul 7th, 12:10 - TornikeO

### The issue of creating samples

Here's a quick tip: Sharing a simple link to an impressive ML [showcase website]({{site.baseurl}}/projects/5_project/) you built from scratch, will increase the chances of you getting hired. Great. So, you want to get a website up and running right away. That's also great, however, unless you have a steady stream of disposable income, you wouldn't want to have a **permanent** **dedicated** **highcpu** **VM** running all the time in the cloud, when typically, you only need to run the sample *once* or *twice* in a week!

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/ld3F1oB.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    IT. IS. EXPENSIVE.
</div>

We are talking about ML samples, mind you. Even the moderately impressive ones require hardware acceleration - GPUs running 24/7. Yeah. It's going to get expensive. 

### User's device as a service (UDaaS)
Just run it on the user's device. 

Pros:
- No need to pay for anything. 
- Godlike scaling. 
- No data shared, no privacy issues.

Cons:
- Increased dev time - you need to rewrite model into a Javascript-compatible format (and, no, the TFJS converter doesn't work 99% of the time). 
- Slow prediction times for users without expensive hardware. 
- It becomes easy to steal your intellectual property (assuming you owned it in the first place)

We are talking about web apps, by the way. Android apps could easily circumvent the `Slow prediction` and `Stealing IP` parts. I've yet to write an ML android app, so this is unreliable.

### Cloud 
Run it in the cloud!

Pros:
- Easy development with containers.
- Handle any complex model quickly.

Cons:
- Cloud is expensive. Especially with accelerators.
- Data privacy issues.
- Scalability (shouldn't be an issue once enough users join)
- Cloud providers try to lock you in their infrastructure.

However, the price and scalability issues can be fixed with correct tools! 


### Enter Kubeflow + Vertex AI pipelines

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://www.stackhpc.com/images/kubeflow.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    Give me my scalable-to-zero VM!
</div>

Say it with me:

**SERVERLESS SCALABLE-TO-ZERO GPU-ACCELERATED SERVICE!**  
**SERVERLESS SCALABLE-TO-ZERO GPU-ACCELERATED SERVICE!**  

Because that's what we need. We don't need to keep any state in the model's memory - "serverless". We need the instance of the model to stop running when there are no requests incoming - "scalable-to-zero". We need quick access to GPU when some input *does* come through - "gpu-accelerated". Finally, we need all of this in an accessible service-like package - imagine how easy it is to write a GCP cloud run function in python and flask - "service". That's it. This solves *checks the notes*, all the problems with using cloud as listed above. You just pay for what you use, and unless you manually cache incoming data somewhere, isn't going to cause privacy issues.

A few years back, especially before the wide adoption of the NVIDIA Ampere GPUs, this was a hard task. Look at these [poor](https://towardsdatascience.com/searching-the-clouds-for-serverless-gpu-597b34c59d55) [souls](https://www.reddit.com/r/MachineLearning/comments/lpld92/d_serverless_solutions_for_gpu_inference_if/). 

But now, things have changed. GCP rolled out [Vertex AI Pipelines](https://cloud.google.com/vertex-ai/docs/pipelines/introduction). 


<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Jrh-QLrVCvM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
</div>
<div class="caption" >
    Give me my scalable-to-zero VM!
</div>

### Current progress

Currently, I managed to get a hello-world sample KFP (kubeflow pipeline) working, on google's Vertex AI pipelines, and the dashboard suggests that the instance is only running when someone queries it. See:

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/YamQGoe.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    Both billing and "Pipelines" dashboard suggest that indeed, this is what I need. Both instances are powered down while not in use.
</div>

The question I'll try to answer today is whether or not GPU acceleration is available here. I mean, it should be. Otherwise this "Vertex AI Pipelines" would just be functionally identical to Cloud Run. So, wish me luck. 