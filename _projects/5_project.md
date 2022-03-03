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

Somehow, MobileNet architectures don't work for deep dreams. Concretely, an 

To be continued...
