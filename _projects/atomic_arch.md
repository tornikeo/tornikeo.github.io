---
layout: page
title: 2D material detection for robotic control
description: 2D materials are the future of computing. Building them, however requires huge human labor - can we automate this?
video: https://i.imgur.com/A8KVknz.mp4
importance: 1
category: work
---

## Introduction

2D materials, like the graphene, have amazing physical properties and carry the promise of bringing huge acceleration to our computer systems. Currently, building complex 2D materials (like transistors) is a laborous, boring and error-prone task, that is done by hand. In this project, I developed an autonomous Computer Vision based real-time approach that classifies and tracks the position of 2D material flakes on the substrate, under the microscope.

The basic premise is simple enough. Based on the [publicly available research](https://arxiv.org/pdf/1311.4829.pdf), one can build multilayer 2D structures (like microscopic pyramids) by following these steps (visualized in the figure below):

- Create a lot of graph*ene* flakes (by scraping the graph*ite* against a thin sheet of uncontaminated plastic)
- Using a microscope, locate suitable 2D flake on that flake
- Using a very fine servo-motor, slowly touch the substrate (i.e. the final destination of the flake) with the plastic
- Heat up the substrate (so that the flake also heats up - this allows it to no loger stick to the plastic)
- Peel off the plastic (if hot enough, the flake will no longer stick to it)

Visually this is seen in the following figure:

<div class="row mt-3">
    <div class="col">
        {% include figure.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/atomic_arch_transfer.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption" >
    (a) Schematic diagram of the experimental setup
    employed for building complex 2D material structures. (b) Diagram of the steps involved in the preparation of the
    stamp (plastic which carries the 2D flake building block) and 2D flake to transfer it onto a user-defined location
    (for instance another 2D flake). From paper <a href="https://arxiv.org/pdf/1311.4829.pdf">
    "Deterministic transfer of two-dimensional materials by all-dry
viscoelastic stamping"</a>
</div>

The downside to all this, is that it is the underpaid and overworked ~~grad students~~ scientists that do all this by hand :smile:. A useful 2D structure could take 100s of layers, and most of the times an error occurs, the process has to be started again from scratch. A huge time waste.

This is why it is incredibly important to automate this process using robotics, and AI. Specifically, this project was fully implemented using Computer Vision (i.e. edge detection, filtration, etc.). 

## Set-up

The simplest way to define the ML problem is:
- In comes a high FPS video feed, depicting the above process, from the point of view of a microscope. For example, this:


{% include video.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/aa-raw-compressed.mp4" caption="Excerpt from the input video sample, in the above video, the crystal flake is being transferred to the substrate." width="70%" %}

In the above video, initially the crystal is very blurry, and comes into the focus plane of the microscope, as the PVC it being lowered to the substrate, which lies directly in the focus plane. At some point, the PVC touches the substrate, and the crystal sticks to the substrate. 



{% include figure.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/Screenshot%20from%202023-03-13%2016-47-06.png" class="center-role-form" caption="At this point, the crystal fully touches the substrate, and the plastic/substrate contact line (thick, dark line, in the top left), is fully beyond the crystal." zoomable=true %}

- The goal of the CV application is to is to rapidly dump the following a JSON-ized information to a specified output file:
    1. Per-frame list of:
        * unique IDs of all detected crystals
        * All points of the substrate/plastic contact line
        * Distances from each detected crystal to the contact line
    2. Additionally, we have to identify the marker symbol and orientation only once per run. More about that below. 
    3. Finally, all the processing has to be done in near-real-time performance. And, the processing has to be causal (i.e. no looking into the future frames).


{% include figure.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/aa-symbol.jpg" class="center-role-form" caption="A sample marker denoting a sector 'D-10' on the substrate. This 'D-10' symbol has to be predicted indepenently of the orientation of the marker." zoomable=true %}




## Implementation

{% include video.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/aa-processed-compressed.webm" caption="Result of CV processsing the video feed (notice how the color of the crystal's ID 'ID09-08' turns to black when the contact line is fully covering it). Green lines from the crystal denote the closest distance to the contact line (also shown as a green curve)" width="70%" %}

In essence, the implementation of this project is separated in following steps:
1. Use initial 10-20 frames to identify, orient and classify the marker and its symbols.
2. Use the initial frames to detect the "background" (i.e. the set of pixels on the screen that belong neither to the crystals, nor the symbols.).
3. Detect crystals by performing canny edge detection, and finding closed contours (except the marker)
4. Detect the polymer contact *area*, by subtracting the background from current frame and joining all large *bright* areas.
5. Draw a line between contact and non-contact areas, and that is the **contact line**.
6. Each crystal is assigned an ID based on its centroid position.
7. Calculate minimum distances from each crystal to the contact line.
8. Dump all the required information in the form of a simple JSON, like:

```json
{
    "timestamp_ms": 00002131,
    "frame_num": 239,
    "crystals": [
        {
            "id": "ID09-08",
            "crystal_contour":[
                [132, 920],
                ...
            ],
            "is_covered": false,
            "polymer_distance": 322,
        }
        ...
    ],
    "polymer": {
        "polymer_contour": [
            [10, 123],
            ...
        ]
    },
    "marker": {
        "id": "D10",
        "rotation": -57,
        "oriented_bounding_box": [[560, 502], [382, 485], ...]
    }
}
```

9. Finally, for visualization purposes, this JSON is loaded into another python script, which makes all the visualizations, and creates a video as shown above.

### Challenges

To be complete...

## Conclusion

To be complete...