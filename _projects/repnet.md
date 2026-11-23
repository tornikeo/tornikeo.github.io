---
layout: page
title: Repetition Counting for Fitness
description: Automatically count reps and sets from video.
img: https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/N9opu9d.gif
preview: /assets/img/project-previews/repnet.webp
importance: 6
category: projects
---

The "repnet", or "repetition counter network" was a bit of an oddball right from the start. The business wanted to create a "universal workout counting and calorie estimation app, from a video". A task, which, after some careful consideration of recent research and the maximum allowed error rate, I carefully laid out was *impossible*. 

So, after some corner-cutting, we arrived at "just count how many reps a person does at a gym". This was also not an easy task. The problem is the typical user is pretty unreliable at providing good quality videos, while also having high initial expectations. 

So, we wanted something to be very robust to visual noise, able to count any kind of repeating motions and be accurate enough for rep counting at a gym. 

After a while, I arrived at [this wonderful article by google](https://ai.googleblog.com/2020/06/repnet-counting-repetitions-in-videos.html). 

<div class="grid gap-4 sm:grid-cols-6">
    <div class="min-w-0 sm:col-span-4 sm:col-start-2" >
        {% include figure.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/9pZ9XHs.png" zoomable=true %}
    </div>
</div>
<div class="text-center text-sm text-muted-foreground" >
        The paper and free, as is the accompanying source code.
</div>


Work-in-progress: more details coming soon...