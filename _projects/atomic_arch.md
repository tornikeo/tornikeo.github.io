---
layout: page
title: 2D material detection for robotic control
description: 2D materials are the future of computing. Building them, however requires huge human labor - can we automate this?
video: https://github.com/tornikeo/cdn/raw/master/assets/atomic_arch/aa-sample.webm
importance: 2
category: large projects
---

# The problem

In this blog, I'll describe how I built a classical computer vision tool for tracking microscopic 2-dimensional flakes, using virtually zero annotated data. The code is [available online](https://github.com/tornikeo/atomic-architects). Here's what I mean by microscopic flakes:

{% include video.html path="https://github.com/tornikeo/cdn/raw/master/assets/atomic_arch/aa-raw-compressed.mp4" caption="One example of an input video feed, straight from the microscope." width="70%" %}

This video shows a transfer of a single microscopic flake to a substrate (fancy name for a floor). If you look at this video from the side, you'd see something like below:
{% include figure.html path="https://github.com/tornikeo/cdn/raw/master/assets/atomic_arch/image-1.png" class="img-fluid rounded z-depth-1" zoomable=true %}

The camera starts by looking through a plastic sheet that has a flake attached to it. The sheet is transparent and out of focus, so it is very blurry initially. The plastic sheet is then lowered to the substrate and it then becomes visible. This step looks like this:

{% include figure.html path="https://github.com/tornikeo/cdn/raw/master/assets/atomic_arch/image-2.png" class="img-fluid rounded z-depth-1" zoomable=true %}


At this point, the flake sticks to the substrate and stays there. The sheet is gently peeled off, leaving the flake in place. This looks like so:

{% include figure.html path="https://github.com/tornikeo/cdn/raw/master/assets/atomic_arch/image-3.png" class="img-fluid rounded z-depth-1" zoomable=true %}

You can also read more about this process in [this paper](https://arxiv.org/pdf/1311.4829.pdf). To actually make something useful, you will need to repeat this flake transfer multiple times and build really complex, tiny structures. The unfortunate hard part is that all of this is a really slow, manual process that requires a lot of patience. 

# The solution

The solution is to automatically track the flakes from the camera feed and use that data to automatically guide a robotic arm to assemble a structure. You could then leave the assembly robot overnight and come back to complete structures. 

One (unworkable) approach is to try fine-tuning an AI model, like [YOLO](https://en.wikipedia.org/wiki/You_Only_Look_Once), to detect the flake for you. This didn't work because we only had 3 really short videos of the above transfer process. 

Because we don't have enough data, we are left in the 'classical' mode of computer vision: frame-differencing, edge detection, et al. So, the algorithm we develop looks like this:

```py
video = open('video.mp4')
# Extract frame as a `numpy` array from video feed, using `pyav`
background = blur(rolling_ball(video[0]))

for idx, frame in enumerate(video)[::3]: # every 3rd frame only
  frame = togray(down(frame)) - background # Downsample, grayscale and subtract background. 
  edges = binarydilate(canny(frame)) # detect edges and dilate to connect edge breaks. 
  blobs = fill_holes(watershed(edges)) # Fill holes to make blobs
  labels = labels(blobs) # Separate blobs get separate IDs
```

This is the basic layout of the code. However, as the plastic sheet touches the substrate, the background changes—it becomes lighter. When that happens, we simply invalidate and recalculate the background. 

This is the core of the algorithm that allows us to track the nanoflakes with really good precision and virtually no data, as shown below:

{% include video.html path="https://github.com/tornikeo/cdn/raw/master/assets/atomic_arch/aa-processed-compressed.webm" caption="Result of CV processing the video feed (notice how the color of the crystal's ID 'ID09-08' turns to black when the contact line is fully covering it). Green lines from the crystal denote the closest distance to the contact line (also shown as a green curve)" width="70%" %}

# Conclusion

Automating the detection and tracking of 2D material flakes using classical computer vision techniques enables efficient robotic assembly, even with minimal annotated data. By using edge detection and image manipulation the system can track the microscopic flakes in this transfer process. This approach reduces manual labor required for constructing complex 2D material structures and could be used for automated fabrication.