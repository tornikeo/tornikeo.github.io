---
layout: page
title: Investigative Video Editor Powered by Meta SAM2
description: Blur, track, and edit objects in video.
video: https://github.com/tornikeo/cdn/raw/master/assets/investigative_ve/thumbnail.webm
importance: 2
category: large projects
---

Lawyers sometimes need to edit video evidence. Common use cases include:

- **Redacting sensitive information:** Blurring faces, license plates, or confidential details to protect privacy.
- **Clipping relevant segments:** Extracting only the portions of video that are relevant to the case.
- **Annotating or highlighting:** Adding timestamps, captions, or arrows to clarify events for the court.
- **Synchronizing with other evidence:** Aligning video with audio, transcripts, or other exhibits for clear presentation.

For instance, shown below is a sample video where we want to track three people and blur out everything else. The original video looks like this:

{% include video.html path="https://github.com/tornikeo/cdn/raw/master/assets/investigative_ve/airport.mp4" caption="Blurring everything except the three people in this video is a lot of work. The aim of this project is to automate this. (Video by Kelly from [Pexels](https://www.pexels.com/video/bustling-airport-terminal-with-travelers-and-sunlight-32649236/))." width="80%" %}

These tasks are typically unavoidable and can be soul-crushing parts of the job. However, with the arrival of new video-centric models, such as Meta's [Segment Anything 2](https://ai.meta.com/sam2/) (SAM2), this has changed.

With SAM2, it is now possible to reliably track objects and people in a video.

## Results

Suppose we want to highlight a group of three people for a presentation.

{% include figure.html path="https://github.com/tornikeo/cdn/raw/master/assets/investigative_ve/airport_selection.png" class="img-fluid rounded z-depth-1" zoomable=false caption="Example initial frame with the selection of three highlighted people." %}

The tool allows automatic tracking of selected objects and is robust against occlusion (occlusion is when an object is temporarily hidden from sight). For instance, the above airport scene, in a few simple clicks, can become this:

{% include video.html path="https://github.com/tornikeo/cdn/raw/master/assets/investigative_ve/airport_masked.mp4" caption="We track and highlight the only three persons of interest, with SAM2." width="80%" %}

Here’s another pair of videos where there is even more significant occlusion, with an even longer tracking time. The original:

{% include video.html path="https://github.com/tornikeo/cdn/raw/master/assets/investigative_ve/trump_tower.mp4" caption="Video by CityXcape from [Pexels](https://www.pexels.com/video/security-at-the-entrance-to-trump-tower-2801200/)" width="80%" %}

With just a few clicks, we select three guards and proceed with tracking. We remove the video background to leave only the guards in place:

{% include video.html path="https://github.com/tornikeo/cdn/raw/master/assets/investigative_ve/trump_tower_masked.mp4" caption="Results of the auto-background removal feature, with SAM2." width="80%" %}

Using this video editing tool is easy. Selecting a face and tracking it can be done with just a few mouse clicks. A button allows for the selection of all items of interest. For the above video, we only needed 12 clicks (marked on the timeline as blue, orange, and cyan dots) to select the three guards. The interface allows for easy visualization and correction of the marks.

{% include figure.html path="https://github.com/tornikeo/cdn/raw/master/assets/investigative_ve/trump_tower_gui.png" class="img-fluid rounded z-depth-1" zoomable=false caption="Example of the graphical application that allows tracking objects inside a video—in this case, we needed only 12 clicks for the three guards." %}