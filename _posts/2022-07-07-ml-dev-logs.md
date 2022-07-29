---
layout: post
title:  MLDev logs - day-to-day log
date: "2022-07-07 11:01:00"
description: Arguably honest logs while learning ML development
tags: Machine Learning, Development
categories: day-to-day
---


## 2022, Jul 7th, 12:10 - TornikeO

### The issue of creating samples

Here's a quick tip: Sharing a simple link to an impressive ML [showcase website]({{site.baseurl}}/projects/5_project/) you built from scratch, will increase the chances of you getting hired. Great. So, you want to get a website up and running right away. That's also great, however, unless you have a steady stream of disposable income, you wouldn't want to have a **permanent** **dedicated** **highcpu** **VM** running all the time in the cloud, when typically, you only need to run the sample *once* or *twice* in a week!

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/ld3F1oB.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    IT. IS. EXPENSIVE.
</div>

We are talking about ML samples, mind you. Even the moderately impressive ones require hardware acceleration - GPUs running 24/7. Yeah. It's going to get expensive. 

### User's device as a service (UDaaS)
Just run it on the user's device. 

Pros:
- No need to pay for anything. 
- Godlike scaling. 
- No data shared, no privacy issues.

Cons:
- Increased dev time - you need to rewrite model into a Javascript-compatible format (and, no, the TFJS converter doesn't work 99% of the time). 
- Slow prediction times for users without expensive hardware. 
- It becomes easy to steal your intellectual property (assuming you owned it in the first place)

We are talking about web apps, by the way. Android apps could easily circumvent the `Slow prediction` and `Stealing IP` parts. I've yet to write an ML android app, so this is unreliable.

### Cloud 
Run it in the cloud!

Pros:
- Easy development with containers.
- Handle any complex model quickly.

Cons:
- Cloud is expensive. Especially with accelerators.
- Data privacy issues.
- Scalability (shouldn't be an issue once enough users join)
- Cloud providers try to lock you in their infrastructure.

However, the price and scalability issues can be fixed with correct tools! 


### Enter Kubeflow + Vertex AI pipelines

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://www.stackhpc.com/images/kubeflow.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    Give me my scalable-to-zero VM!
</div>

Say it with me:

**SERVERLESS SCALABLE-TO-ZERO GPU-ACCELERATED SERVICE!**  
**SERVERLESS SCALABLE-TO-ZERO GPU-ACCELERATED SERVICE!**  

Because that's what we need. We don't need to keep any state in the model's memory - "serverless". We need the instance of the model to stop running when there are no requests incoming - "scalable-to-zero". We need quick access to GPU when some input *does* come through - "gpu-accelerated". Finally, we need all of this in an accessible service-like package - imagine how easy it is to write a GCP cloud run function in python and flask - "service". That's it. This solves *checks the notes*, all the problems with using cloud as listed above. You just pay for what you use, and unless you manually cache incoming data somewhere, isn't going to cause privacy issues.

A few years back, especially before the wide adoption of the NVIDIA Ampere GPUs, this was a hard task. Look at these [poor](https://towardsdatascience.com/searching-the-clouds-for-serverless-gpu-597b34c59d55) [souls](https://www.reddit.com/r/MachineLearning/comments/lpld92/d_serverless_solutions_for_gpu_inference_if/). 

But now, things have changed. GCP rolled out [Vertex AI Pipelines](https://cloud.google.com/vertex-ai/docs/pipelines/introduction). 


<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Jrh-QLrVCvM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
</div>
<div class="caption" >
    Give me my scalable-to-zero VM!
</div>

### Current progress

Currently, I managed to get a hello-world sample KFP (kubeflow pipeline) working, on google's Vertex AI pipelines, and the dashboard suggests that the instance is only running when someone queries it. See:

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/YamQGoe.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    Both billing and "Pipelines" dashboard suggest that indeed, this is what I need. Both instances are powered down while not in use.
</div>

The question I'll try to answer today is whether or not GPU acceleration is available here. I mean, it should be. Otherwise this "Vertex AI Pipelines" would just be functionally identical to Cloud Run. So, wish me luck. 


## 2022, Jul 26th, 21:10 - TornikeO

I'm currently working on building a human-shape-from-image paper, called SHAPY from CVPR2022. It's a solid paper, with solid results, however, it is an absolute PITA to install and run. The documentation is lacking. Concrete example of this is the fact that you need to install `libturbojpeg` and there is no mention of this anywhere, except the issues tab (what would it take to update a `README.md`, like, 20 minutes?). Worse still is the fact that the library depends on OpenPose. A library that's extremely hard to use in headless linux environment. 

So, lo and behold, I manged to get everything working. How? 

1. I install shapy repo and follow instructions precisely (if you get "import attributes" error, that means you need to look for the `export $PATH` command in the install guide and run that). Another error comes from a missing dependency, libturbojpeg. I did `sudo apt-get install libturbojpeg`, or a variation of the package's name, can't recall.
2. Did a sample run on the `regression/demo.py`. To run on new images, we have to change openpose dataset location arg.
4. SHAPY depends on JSON pose keypoints. This is generated by openpose. Here's where the pain begins - openpose doesn't provide linux builds. So you have to build one yourself within or outside of docker. 
5. I managed to run openpose within a docker container, using [this guide](https://janbkk10.medium.com/build-to-openpose-docker-on-ssh-server-5603874834e9). This took over 3 hours. :/ Installation takes good 30 minutes or more on 12 vCPU machine.
6. Once done, find openpose docs for CLI usage, you will need to use `--write_json` arg for this. 
7. Use FFMPEG to extract frames from a video
8. Use openpose to create JSONs for frames
9. Use SHAPY regressor to predict shape -> ply file
10. Use shapy virtual measurements tool to extract measurements from generated shapes. Ply -> Measurements (30x)
11. Average measurements out for more accuracy. Average measurements.

TODO: Check out polycam. 

## 2022, Jul 27th, 23:10 - TornikeO

Here's a summary of what I learned today. When using "official" pytorch docker images, "sudo apt update" command will error out 
with a something about missing GPG Keys for NVIDIA packages. This is fixed by the following two lines:

```Dockerfile
RUN rm /etc/apt/sources.list.d/cuda.list
RUN rm /etc/apt/sources.list.d/nvidia-ml.list
```

The source of this fix is [on github](https://github.com/NVIDIA/nvidia-docker/issues/1632#issuecomment-1112667716).

Second, the Dockerfile build process fails at the when at the `mesh-mesh-interaction` directory, we execute `setup.py`. I tried two separate base images for this, one from pytorch docker and other from nvcr repository, and both fail, saying `No CUDA runtime is found, using CUDA_HOME=’/usr/local/cuda’`. I have yet to find a solution to this problem. Maybe drivers are missing?

Several things to try out tomorrow:
- Omit faulty line and instead manually run `nvidia-smi` within the container. Does this output the expected summary?
- Start from Ubuntu base image. Install everything by hand. Commit as a new image. Yeah, this sounds exhausting. 

[x] Docker image for both OpenPose
[ ] Docker image for SHAPY 

## 2022, Jul 28th, 19:41 - TornikeO

Today I had to concentrate on *proving* that SHAPY has accurate measurements. So, I was given a sample video of one of remote colleagues moving around within a video. All I had to do, is extract some frames from the video, run them through first OpenPose and then through SHAPY and then present the results.

So, that's what I did. I was given a 2000px by 1600px video, which, let's be real, is of too high a resolution. I needed an easily automatized way of extracting the frames from the video as well as resizing the resulting frame's *longest* size to the default 600px (that's what the sample SHAPY images already come with). Here's an FFMPEG command that does all that in one go:

```bash
ffmpeg -i inp.avi -filter:v scale=300:-1 -r 1 images/img_%03d.png
```

In case you also need to flip the frames around, you can use this

```bash
ffmpeg -i inp.avi -vf transpose=1 -r 5 images/img_%03d.png
```

You also can combine all these flags that make sense together. Giving you the ability to easily define preprocessing pipeline.

Second, I forgot that OpenPose in a headless server (docker), requires special args to not fail (the error  logs are not that helpful, although it does mention word "display" at some point).

First, we instantiate the container
```bash
# Note that in my case the main repo rests in /home/jupyter/shapy2 path
# Your's might be different
# Also, --gpus all is important!

docker run --gpus all -it --rm \
    -v /home/jupyter/shapy2:/workdir \
    tornikeo/openpose /bin/bash
```

Enter the docker env and run the following command (assuming you do have images )

```bash
# Within tornikeo/openpose, with --gpus all arg
# --write_images is optional. I like to keep it to sanity check keypoints
# Make sure that that all the limbs are actually there!
./build/examples/openpose/openpose.bin \
    --display 0 --render_pose 0 \
    --image_dir /workdir/samples/custom/images/ \
    --write_json /workdir/samples/custom/openpose/ \
    --write_images /workdir/samples/custom/openpose/keypoint_sanity_check
```


The above command will create json keypoint files. However, it's not ideal. Here's why: Each created file will have an extra '_keypoints' at the end of the file name. To remove it efficiently, **install the `rename` apt package**. I did it outside the docker env, since that doesn't concern openpose. 

```bash
# OUTSIDE of the docker container, in the keypoints folder.
# To rename the results to match starter files
# You might need to install this package!
# sudo apt install rename
rename  's/_keypoints//' *
```

Now we have everything we need for SHAPY to run. We have images and keypoints. Let's run it. I have created a folder `custom` and arranged it to fully mimic the original SHAPY folder structure. That way, you only have to add `custom/` to three places to avoid overwriting SHAPY's included stuff.

```bash
# You are at SHAPY/
export PYTHONPATH=$PYTHONPATH:$(pwd)/attributes/
cd regression
python demo.py --save-vis true \
    --save-params true \
    --save-mesh true \
    --split test \
    --datasets openpose \
    --output-folder ../samples/custom/shapy_fit/ \
    --exp-cfg configs/b2a_expose_hrnet_demo.yaml \
    --exp-opts output_folder=../data/trained_models/shapy/SHAPY_A \
        part_key=pose \
        datasets.pose.openpose.data_folder=../samples/custom/ \
        datasets.pose.openpose.img_folder=images  \
        datasets.pose.openpose.keyp_folder=openpose \
        datasets.batch_size=1  \
        datasets.pose_shape_ratio=1.0
```

Now let's do measurements:

```bash
# You are at SHAPY/
export PYTHONPATH=$PYTHONPATH:$(pwd)/attributes/
cd measurements
python virtual_measurements.py \
    --input-folder ../samples/custom/shapy_fit/ \
    --output-folder=../samples/custom/virtual_measurements/
```
Now, the default image outputs are not going to be helpful. You will need to somehow aggreage the N frames you get (each frame gets it's own shapy estimate).

<div class="row mt-3" style="justify-content:center;">
    <div class="col-sm-8 mt-3 mt-md-0" >
        {% include figure.html path="https://i.imgur.com/b9fn695.png" class="img-fluid rounded z-depth-1" zoomable=false %}
    </div>
</div>
<div class="caption" >
    Default image that is generated isn't too helpful, when you have many frames.
</div>

For that, we modify the `measurements/virtual_measurements.py` file a little. We import pickle and add the following lines starting at line 83:

```python
    # print result <-- this is line 83
    mmts_str = '    Virtual measurements: '
    mmts_dict = {}
    for k, v in measurements.items():
        value = v['tensor'].item()
        unit = 'kg' if k == 'mass' else 'm'
        mmts_str += f'    {k}: {value:.2f} {unit}'
        mmts_dict[k] = value
        
    with open(osp.join(demo_output_folder, 
                        npz_file.replace('npz', 'pickle')), 'wb') as handle:
        pickle.dump(mmts_dict, handle)
```

We save measurements with `mmts_dict[k] = value` and export it as a pickle. This is done for each frame. So, we need another script, which does the following:

```python
import pickle
import os
import glob
import pandas as pd
meas = []
for file in glob.glob('*.pickle'):
    meas.append(pickle.load(open(file,'rb')))
meas = pd.DataFrame(meas)
print(meas.describe())
```

That's it for today. We have an estimate and we have statistics. 

## 2022, Jul 29th, 22:05 - TornikeO
We have little in the way of discoveries today. However, I did manage to make an **end-to-end** jupyter notebook that inputs a video and outputs a measurement, based on the $$N$$ evenly-spaced frames from it.

Some issues were definitely encountered, though. Let's go over the major ones.

First off, the design. It is tempting to try to write the most general program for the given task, and just the thought of every possiblity might make you a *very* inefficient programmer. So, instead, what I think about is the functonality that 95% of the usecases are going to be happy with? Bonus points if you try to write the code so that it's easy to extend and modify (depends on as little as possible and is as easy to understand as possible). I went with the good 'ol main for loop design. After all, we will be given a list of videos, and we gotta measure the whole lot of 'em. So, the the pseudo-code looks like this:

```python
for video in videos:
    frames = ffmpeg_extract_frames(video, num_frames)
    keypoints = openpose_keypoints(frames)
    shapes_3d = shapy_estimate_shape(frames, keypoints)
    all_meas = virtual_meas_tool(shapes_3d)
    print('Video: ', video, 'Final meas: ', mean(all_meas))
```

Easy, right? Well, almost. The FFMPEG is easy enough:

```bash
ffmpeg -i {input_video} \
    -hide_banner \
    -filter:v scale=300:-1 \
    -vframes {num_frames} \
    {img_dir}/img_%03d.jpg
```

OpenPose lives inside a docker container, so its a bit verbose:

```bash
docker run --gpus all \
    -it --rm \
    -v {output_dir/'images'}:/workdir/input \
    -v {output_dir/'openpose'}:/workdir/json \
    -v {output_dir/'openpose'/'pose'}:/workdir/pose \
    tornikeo/openpose:latest \
        ./build/examples/openpose/openpose.bin \
            --display 0 \
            --image_dir /workdir/input \
            --write_json /workdir/json/ \
            --write_images /workdir/pose
```

There is a potential bug source here - sometimes openpose doesn't detect all keypoints, leading to weird final measurements in SHAPY. To prevent that, we'll have to filter the outputs, making sure this doesn't happen.

We also need to replace the the extra `_keypoints` suffix in file names like so:

```py
for kpt in (output_dir/'openpose').glob('*.json'):
    kpt.rename(str(kpt).replace('_keypoints',''))
```

Now comes the hard part. I have to different conda environment in the following cell, since, at the time, I didn't know how to change notebook kernel in jupyterlab without restarting it. Here's the trick to do it:

```bash
%%bash -s "$output_dir" #<-- more about this below!
eval "$(command conda 'shell.bash' 'hook' 2> /dev/null)"
export PYTHONPATH=$PYTHONPATH:$(pwd)/attributes/
conda activate shapy2
cd regressor
python demo.py --save-vis true \
    --save-params true \
    --save-mesh true \
    --split test \
    --datasets openpose \
    --output-folder $1/shapy_fit \
    --exp-cfg configs/b2a_expose_hrnet_demo.yaml \
    --exp-opts output_folder=../data/trained_models/shapy/SHAPY_A \
        part_key=pose datasets.pose.openpose.data_folder=$1 \
        datasets.pose.openpose.img_folder=images  \
        datasets.pose.openpose.keyp_folder=openpose \
        datasets.batch_size=3  \
        datasets.pose_shape_ratio=1.0
```

I copied this from a StackOverflow answer, saw that it worked (`which python` showed the correct path) and never looked back :smiley:. The rest is just the same as in the base repository. Except for one caveat! You see, I'm using a IPython environment. And I need to somehow communicate python variables to `%%bash` cells. Inline bash calls, with `!` operator, is easy, you just wrap your variable in `{curly_brackets}` and it just works. This fails, however, in bash cells. So, you have to use the above approach add `-s "$var_name"` after the `%%bash` line. You can then access that variable as a `$1` temporary variable within the cell. Neat.

Next comes the measurements tool:

```bash
%%bash -s "$output_dir"
eval "$(command conda 'shell.bash' 'hook' 2> /dev/null)"
export PYTHONPATH=$PYTHONPATH:$(pwd)/attributes/
conda activate shapy2
cd measurements
python virtual_measurements.py \
    --input-folder=$1/shapy_fit/ \
    --output-folder=$1/virtual_measurements/
```

Finally, we do the measurements aggregation, like so:

```py
import pandas as pd
import pickle
meas = []
for file in (output_dir/'virtual_measurements').glob('*.pickle'):
    meas.append(pickle.load(open(file,'rb')))
meas = pd.DataFrame(meas)
meas.describe()
```

Remember, I modified the `virtual_measurements.py` to pickle the useful vars and save the separately. So, there you have it, the whole pipeline, end to end!

The next step would be to also dockerize the SHAPY and reduce the complexity and fragility of this pipeline. 

  