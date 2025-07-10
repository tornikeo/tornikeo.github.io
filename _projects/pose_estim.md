---
layout: page
title: Lightweight pose estimation with Mediapipe
description: Ever wondered how do those fancy whatsapp filters work? Here I will use holistic mediapipe for creating full-body meshing.
video: https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/gvVCAmX.mp4
importance: 1
category: projects
---


Written by: [@tornikeo](https://github.com/tornikeo) and [@GPT3](https://openai.com/api/)


<div class="row mt-3" class="center-role-form">
    <div class="col-12" >
        <iframe src="https://tornikeo.com/holistic-mediapipe/" 
        height="900" width="1200"  allow="camera" allowfullscreen frameborder="0"
        style="
            -webkit-transform:scale(.84);
            -moz-transform-scale(.84);
            right:240px;
            position:relative;
        "
        ></iframe>
    </div>
</div>
<div class="caption" >
    The embeddable iframe allows any casual user to 
    use pose estimation within their web-app, for free!
</div>



### Overview by [@tornikeo](https://github.com/tornikeo)

Pose estimation is the process of determining the position and orientation of an object in an image. It can be used for a variety of purposes, such as 3D reconstruction, object tracking, and human-computer interaction. The MediaPipe technology can be used to estimate pose from the camera input in real-time. This web-app is completely free, is self-hosted and is very fast. 

Additional benefits include - the ability to simply copy-paste the `iframe` tag to include the pose estimation on any website. The open source nature of this project (here's the full [repo](https://github.com/tornikeo/holistic-mediapipe)). 

Some limitations would be as follows: Since this is self-hosted, its performance heavily depends on the client-side compute capability. Clients without GPU access, for example, could experience drop in FPS. 

Future work would be to create android or iOS app for pose estimation - potential uses could be estimating athletic performance, calculating calories spent on exercise or, use AR (augmented reality) approaches to modify the predicted pose into interesting shapes for fun!


### Overview by [@GPT3](https://openai.com/api/)

#### Potential use-cases for pose estimation web-app:

Pose estimation can be used for a variety of applications. Some potential use-cases for a pose estimation web-app include:

- Tracking the movement of objects in a 3D space
- Generating 3D models of objects
- Creating virtual reality experiences
- Analyzing human movement for health or fitness purposes

####  Usefulness of the web-app:

The web-app is completely free, is self-hosted and is very fast (real-time). This makes it an ideal tool for developers or businesses who want to create applications or services that make use of pose estimation.

#### Summary and future goals:

The pose estimation web-app is a simple and fast way to estimate pose from camera input. The app is free and self-hosted, making it easy to use for developers or businesses. The goal is to eventually port the app to Android or iOS, making it even more accessible.


