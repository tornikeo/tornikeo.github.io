---
layout: page
title: Style Attentional Networks in JS
description: Attentional neural networks are a powerful tool for building language models. But we can also use attention mechanism to stylize images efficiently enough for <b>within</b> the web-browser. 
img: assets/img/sanet.jpg
importance: 1
category: work
---

Written by: [@tornikeo](https://github.com/tornikeo) and [@copilot](https://copilot.github.com/) 

<iframe src="https://tornikeo.github.io/embed-stylize" height="720px" width="100%" frameborder="0" allowfullscreen></iframe>

## SANet in TensorflowJS
# Background

The implementation of SANet's paper may be found in the following github repository. Initial problems included anything from adequately setting up the environment to running inference to addressing numerous errors due by outdated dependencies. PyTorch was used to create the project. However, the end-goal of this project was to construct a user-friendly web-application from the beginning. We started building this webapp by putting the code on DigitalOcean immediately. This deployment, on the other hand, would be troublesome because our web app was incredibly sluggish to launch and prone to crashes owing to the server's limited RAM.

It wasn't long before it became clear that implementing SANet would necessitate hiring a pricey GPU-powered server. Otherwise, the computing demands would most certainly overwhelm it. This, combined with internet latency concerns and the presumably private nature of the photographs shared, encouraged us to look for other options.

TensorflowJS is likely the only javascript-based machine learning framework that is both fast and simple to use as of January 2022. Because TFJS is built on javascript, any model created with it may operate without the need for a server. The client operates the network on their own device once the server gives roughly 80MB of network weights once. The original PyTorch implementation's latency, privacy, and cost problems are no longer an issue. To do so, though, we'll need to convert the PyTorch network weights to TensorflowJS.

## The Transfer

We rapidly discovered that translating a PyTorch model to Tensorflow, let alone TensorflowJS, is not straightforward. However, there is an intermediary framework called Open neural network exchange (ONNX) that intends to function as a bridge across several machine learning frameworks including MXNet, Jax, Pytorch, and Tensorflow. It's feasible to export PyTorch models into ONNX format if they're appropriately built. The ONNX conversion rules are not followed in the original implementation. To remedy this, we first re-implemented the SANet within the PyTorch framework, namely by building a new version of the SANet block that replaces the disallowed dynamic reshape operation with the supported `flatten(A,2)`. 

We also deactivate constant folding and specify dynamic axes in the `onnx.export` method to handle different picture input sizes (dynamic axes, like height and width are not fixed). We export the PyTorch model into three independent sections after making these changes and addressing other minor issues: `encoder.onnx`, `decoder.onnx`, and `transform.onnx`, which correspond to the same three parts in the architecture. Because the whole SANet algorithm requires a for-loop, which is not feasible to export within ONNX, this division into three pieces is essential.

The three ONNX model files were then converted into three Tensorflow saved-models using the onnx-tensorflow library. We then individually imported the three Tensorflow saved-models and constructed a new `TFStyle` `tf.Module` subclass. This class would do all necessary computations on the two input photos, including the for-loop action that is required. The outputs of the `TFStyle` class were then compared to the PyTorch implementation to ensure that they were identical to a floating point precision. To be able to successfully export this model to a TensorflowJS environment, we simply need to put up the Tensorflow Serving signature for it at this point. The serving signature was created to accomplish the following goals:

* Accept any two photos with any shapes as input.
* Accept two more options (num iterations, max resolution).
* Using max resolution, rescale and normalize the photos.
* Stylize (with the num iterations parameter for style strength)
* Reshape the output to match the original content image's shape.
* Return the outcomes

Finally, using the TensorflowJS converter tool, the TFStyle model and the Serving signature are converted to a JSON format. This creates an 80MB model folder that can be used in a web app with the TensorflowJS framework.

## Final steps

The website was launched in two phases. To begin, a prototype was created in pure HTML and Javascript to ensure that the exported TFJS model was not corrupted.

Several issues were discovered and resolved throughout the development of the initial iteration. Problems with javascript package versions, picture data loading from the site, and different TensorflowJS issues, many of which are caused by a lack of Javascript expertise.

Finally, we developed an interactive blog-like website, after troubleshooting the flaws in the initial version of the website. (right). Jekyll, a popular and easy-to-use blog-creation tool, is used on this site. Jekyll creates a blog-like website by converting a plain markup language. This conversion takes place only once, and the HTML and CSS files that result are saved to disk. However, in order to make a website accessible to the general public, we needed to employ GitHub-Pages, a service that provides for the free hosting of a website under a unique domain name. When GitHub detects a change in the repository, we used GitHub-Pages in conjunction with GitHub Actions (a continuous Integration service) to automatically recompile and update the website. All of this occurs without the need for human intervention. Finally, we created a blog around the interactive stylization app that explains the inner workings and features of the SANet and can be used as a portfolio/showcase website in the future.