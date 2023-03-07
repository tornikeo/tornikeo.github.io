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

## Details

This blog is currently under development. Stay tuned!