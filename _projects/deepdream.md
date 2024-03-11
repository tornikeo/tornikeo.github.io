---
layout: page
title: Deep Dream with TFJS
description: Why pay $5 subscription fee when you can deepdream images in your browser?
img: assets/img/deepdream-monke.png
importance: 20
category: personal
---

Well, since I'm working on making attentional style transfer [model](https://github.com/GlebSBrykin/SANET/tree/master/style) smaller and faster by replacing the VGGs with much faster MobileNets, I thought it would make it easier to avoid potential bugs by first doing a similar replacement in a much easier task - deep dream.


<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        <iframe src="https://tornikeo.github.io/embed-deepdream" height="805px" width="550px" frameborder="0" allowfullscreen></iframe>
    </div>
</div>
<div class="caption" >
    Interactive deepdream (Based on MobileNetV2's deep features)
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
        {% include figure.html path="https://storage.googleapis.com/tornikeo-portfolio-cdn/imgur/Vv9MkE6.png" class="img-fluid rounded z-depth-1" zoomable=true %}
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

We a load of problems. First off, we need an autgrad library, for Javascript. The only well-rounded library to do that is the `Tensorflow.JS`. Second, we need a way to extract intermediate representations from that a network (that maybe doable with the as a builtin tfjs feature -- hopefully including tfhub models). Third, we need adjust the network input-output size. We need higher definition, and MobileNet, which is a convnet, should easily allow that. 

Last, but not least, it is important that we carefully replicate every single line of code we have within the original kaggle notebook. NNs have a huge error surface and postpartum NN bugfixing is never fun. 

The project is hosted at [a public repository](https://github.com/tornikeo/embed-deepdream/tree/master).

## Rudimentary implementation

Following in the footsteps of the [popular tensorflow implementation](https://www.tensorflow.org/tutorials/generative/deepdream) of the DeepDream algorithm, I set up a training loop using the TFJS library, backed by common JS tools, such as [Webpack](https://webpack.js.org/), [NPM](https://www.npmjs.com/) and [NodeJS](https://nodejs.org/en/). 

Webpack is known to be quite verbose and requires a non-trivial amount of boilerplate in order to function. To avoid this and focus more on the ML aspect of the project, I start off my work with the [webpack boilerplate](https://github.com/taniarascia/webpack-boilerplate), while making sure that all [the contributors](https://github.com/taniarascia/webpack-boilerplate/graphs/contributors) get their authorship, by carefully preserving the commit history within a [new repository](https://github.com/tornikeo/embed-deepdream). 

## Dev logbook

### 2022 Jun 18, 23:40 TornikeO

In order to use more feature layers from the base model (MobileNetV2), and to also have more control over model parameters, I opted for generating a custom TFJS model. 

Inferene speed is of paramount importance, so, I compared the following promising model architectures for speed on CPU:

- MobileNetV3Small (62.2 ms)
- MobileNetV2 (**61.1 ms**)
- EfficientNetV2B0 (111 ms)
- EfficientNetB0 (112 ms)

I finally went with MobileNetV2. 


### 2022 Jun 19, 01:10 TornikeO

Including the rescaling layer into the model isn't going to be easy, since Lambda layers are not supported within TFJS converter. Instead chose to leave that task to the JS codebase. So, **scaling is required** (input has to be in -1 to 1 range)!.

The Deep Dream requires feature vectors (or hidden activations, as they call it). I don't know how to get intermediate outputs from loaded TFJS models, so, instead that task goes to Python part: The conversion-ready model already outputs 5 feature vectors from `block_n_add` layers. In th end, the `n` should be a tweakable UI input. 

Model also doesn't input Batch size, that's handled by the signature function. Output is also batch-less. Also, fp16 quantization happens to all nodes. Had to double check that there are no int nodes within the model (Learned the hard way what reckless quantization can do to a model with int nodes). 

### 2022 Jun 19, 18:10 TornikeO

Fixed the issue with model path. Turns out, `webpack.common.js` redirects all queries from `'assets/models/*'` to the `public/models` directory. Also tweaked the learning rate and updated the `getGradient` function to gather gradients from multiple hidden layers. 

Seems like higher learning rates (0.1,0.05) are more unstable for shallower layers like `block_1_add` but not deeper ones. 


