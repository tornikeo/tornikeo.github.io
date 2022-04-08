---
layout: page
title: Beating Tox21 challenge with <b>way</b> too many parameters
description: "Task: predict all 1.5k possible toxic effects of a given compound, given its name. <br> Solution: Deep Learning"
img: assets/img/tox21-model-arch.png
importance: 2
category: work
---

Written by [@tornikeo](https://github.com/tornikeo) and [@copilot](https://copilot.github.com)

This is one of my favourite projects from 2021. So, naturally, I'd like everyone reading this to understand the task at hand as well as a glimpse into how my solution works :smile:. 

## Introduction

When a pharmaceutical company announces a groundbreaking new drug, usually people don't think too hard about all the hard work and funding that went into developing that drug. What people do notice, however, is the *price*. New drugs cost a lot more than the generic over-the-shelf drugs, e.g aspirin. This is because the pharma has to cover the development expenses -- including making sure that the drug is safe for human consumption. 

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-6 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/OeCjQCn.jpeg" class="img-fluid rounded z-depth-1" zoomable=true %}
        <div class="caption">
            The network gradually learns complex molecular patterns by combining basic shapes (from deeptox)
        </div>
    </div>
    <div class="col-sm-6 mt-3 mt-md-0" >
        {% include figure.html path="assets/img/tox21-model-arch.png" class="img-fluid rounded z-depth-1" zoomable=true %}
        <div class="caption">
            The winning architecture is a dense neural network with over 1 million parameters
        </div>
    </div>
    <div class="caption" >
        Images from <a href="https://paperswithcode.com/dataset/tox21-1">PapersWithCode</a>
    </div>
</div>

That last part is what the `Tox21` dataset is all about. As you might have already guessed, the dataset is about predicting the toxicity of new drugs. Whether or not the drugs actually *do* work is a whole 'nother field, and `Tox21` doesn't touch that. 


<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-6 mt-3 mt-md-0" >
        {% include figure.html path="https://www.ris.world/wp-content/uploads/2020/06/ECHA-animal-testing-alternatives-report-for-REACH-regulation-2020_wrbm_large-300x183.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        <div class="caption">
            <i>In vitro (meaning in glass, or in the glass) studies are performed with microorganisms, cells, or biological molecules outside their normal biological context...</i>
            <br>
                -- <a href="https://en.wikipedia.org/wiki/In_vitro"> wikipedia</a >
        </div>
    </div>
    <div class="col-sm-6 mt-3 mt-md-0" >
        {% include figure.html path="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Wistar_rat.jpg/300px-Wistar_rat.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
        <div class="caption">
            <i>Animal testing, also known as animal experimentation, animal research, and in vivo testing, is the use of non-human animals in experiments that seek to control the variables that affect the behavior or biological system under study...</i>
            <br>
                -- <a href="https://en.wikipedia.org/wiki/Animal_testing"> wikipedia</a >
        </div>
    </div>
</div>

Usually, the toxicity tests are first done on tissue samples under the microscope, these being called *in vitro* tests, and then on some unlucky lab animals -- called *in vivo* tests. Huge ethical problems aside, this process is *very* expensive. So, much so that many companies are now considering implementing a third kind of testing, aptly called *in silico* testing.

*In silico* tests (meaning in silicon, or in computer chip) are computer programs that take into account thousands of parameters about a given chemical in order to predict its toxicity. 

> "Robots are taking our jobs!"  
> -- Unemployed laboratory rats (circa 2030)

And that's where this project comes in. We have seen [time](https://en.wikipedia.org/wiki/AlexNet) and [time](https://deepmind.com/blog/article/alphafold-a-solution-to-a-50-year-old-grand-challenge-in-biology) again how neural networks can learn to solve complex problems. The goal here is to design a neural network that can accurately predict the result of chemical-to-cell interactions. 

Now, what exactly does "chemical-to-cell interactions" mean? Well, this can be explained in a lot of ways, but, since I am no biochemist, I'll try to stick to the AI-side of the things. 

## Interactions, a **lot** of them

The entire thing I am solving here can be represented as a neat, 3 column table, as shown below:

| Name of chemical | Name of toxic effect | Is toxic? |
|---|---|---|
| Aspirin | Cell death | YES |
| Aspirin | DNA damage | NO |
| Adrenaline | Cell death | NO |
| Adrenaline | DNA damage | YES |
{:.table}

In this *grossly* incorrect sample table, we have two chemicals (aspirin and adrenaline), two possible effects (cell death and DNA damage) and two possible results (YES and NO). The first two columns are given, the last column has to be predicted. 