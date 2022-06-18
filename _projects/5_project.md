---
layout: page
title: Deep Dream with TFJS
description: Why pay $5 subscription fee when you can deepdream images in your browser?
img: assets/img/deepdream-monke.png
importance: 3
category: fun
---

Well, since I'm working on making attentional style transfer [model](https://github.com/GlebSBrykin/SANET/tree/master/style) smaller and faster by replacing the VGGs with much faster MobileNets, I thought it would make it easier to avoid potential bugs by first doing a similar replacement in a much easier task - deep dream.
<div class="row mt-3" style="justify-content:center;">

<iframe src="https://tornikeo.github.io/embed-deepdream" height="1000px" width="900px" frameborder="0" allowfullscreen></iframe>
</div>

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="/assets/img/model-arch.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption" >
    Model architecture from original <a href="https://arxiv.org/abs/1812.02342">paper</a>
</div>

[DeepDream](https://en.wikipedia.org/wiki/DeepDream) works by performing a gradient *ascent* on an image, using a pre-trained network activations as loss. Something like this:

```python
net = VGG19(pretrained=True, 
    get_deep_activations=['relu4_1','relu5_1'])
image = randn(1,512,512,3)
for i in range(100):
    deep_activations = net(image)
    loss = deep_activations.sum()
    image_gradient = grad(loss, image)
    image = image + 0.001 * image_gradient # Notice the "+" here. 
```

The end-result is a `1,512,512,3` tensor that excites `VGG19` `relu4_1` and `relu5_1` layers the most. But that's not interesting. What's mind-blowing though, is that the end-result looks like a surreal dream:


<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-6 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/Vv9MkE6.png" class="img-fluid rounded z-depth-1" zoomable=true %}
        <div class="caption">
            Original image
        </div>
    </div>
    <div class="col-sm-6 mt-3 mt-md-0" >
        {% include figure.html path="assets/img/deepdream-monke.png" class="img-fluid rounded z-depth-1" zoomable=true %}
        <div class="caption">
            Resulting image
        </div>
    </div>
    <div class="caption" >
        Images from pytorch <a href="https://www.kaggle.com/paultimothymooney/pre-trained-pytorch-monkeys-a-deep-dream">implementation</a>
    </div>
</div>

The hint to the "why?" is the fact that the layer choice matters a **lot**. Earlier layers produce more minimalistic images (think of a cubist painting) and later ones produce very detailed dream images.

## The problems at hand

We a load of problems. First off, we need an autgrad library, for Javascript. The only well-rounded libraary to do that is the `Tensorflow.JS`. Second, we need a way to extract intermediate representations from that a network (that maybe doable with the as a builtin tfjs feature -- hopefully including tfhub models). Third, we need adjust the network input-output size. We need higher definition, and MobileNet, which is a convnet, should easily allow that. 

Last, but not least, it is important that we carefully replicate every single line of code we have within the original kaggle notebook. NNs have a huge error surface and postpartum NN bugfixing is never fun. 

The project is hosted at [a public repository](https://github.com/tornikeo/embed-deepdream/tree/master).

