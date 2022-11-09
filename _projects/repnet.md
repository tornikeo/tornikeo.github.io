---
layout: page
title: Repetition counting - for fitness!
description: Automatically enumerate reps and sets from a video!
img: https://i.imgur.com/N9opu9d.gif
importance: 6
category: work
---

The "repnet", or "repetition counter network" was a bit of an oddball right from the start. The business wanted to create a "universal workout couting and calorie estimation app, from a video". A task, which, after some careful consideration of recent research and the maximum allowed error rate, I carefully laid out was *impossible*. 

So, after some corner-cutting, we arrived at "just count how many reps a person does at a gym". This was also not an easy task. The problem is the typical user is pretty unreliable at providing good quality videos, while also having high initial expectations. 

So, we wanted something to be very robust to visual noise, able to count any kind of repeating motions and be accurate enough for rep counting at a gym. 

After a while, I arrived at [this wonderful article by google](https://ai.googleblog.com/2020/06/repnet-counting-repetitions-in-videos.html). 

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/9pZ9XHs.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption" >
        The paper and free, as is the accompanying source code.
</div>


Work-in-progress: more details coming soon...