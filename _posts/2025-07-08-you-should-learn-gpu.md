---
layout: post
title: "You should learn GPU programming"
description: Now is the best time to learn programming GPUs
---

It is now a good time for learning to program [GPUs](https://www.youtube.com/watch?v=h9Z4oGN89MU), and I'm here to convince you to do just that. Here's why:

## Fast
Fast is good. Software is more accessible and useful when it is fast. 
People also become more productive when you give them fast software. 
Programming a GPU allows you to do just that: write some incredibly fast software. 

In one instance, I managed to make software x1700 faster by programming a GPU. 
![](https://github.com/PangeAI/SimMS/raw/main/assets/perf_speedup.svg)

In [another](https://urn.fi/URN:NBN:fi-fe2025063075583) instance, I managed to get a x25 speedup over a parallel 32 CPU system:
![](https://github.com/tornikeo/cdn/raw/master/assets/thesis/gpu_vs_cpu_scaling.png)


## Accessible
GPUs are everywhere. Really. If you write a GPU program, you can run that program on:

- Google Colab for free
- Your own gaming laptop
- Vast.ai, RTX4090 at $0.23/hr
- AWS, T4 at $0.56/hr
- GCP, T4 at $0.35/hr

Your GPU code is guaranteed to be compatible with both older GPUS and newer GPUs, gaming GPUs and server GPUs. 

## Appreciation
GPU programs become more valuable with time. They appreciate in value. 
Suppose you write a GPU program that calculates how atoms interact. 
Your GPU program will (due to CUDA) be forward compatible with newer GPUs like H200. 
Also it will become faster, because the speed of most GPU programs depends on the memory bandwidth of the GPU. Memory bandwidth has been increasing exponentially for over 20 years:

![](https://github.com/tornikeo/cdn/raw/master/assets/learn-gpu/gpu_memory_bandwidth_by_year.png)

GPU program will appreciate in value, because it will become exponentially faster in the future.

## Depreciation 
Most GPU power is used for AI in 2025. However, AI getting smaller and GPU-independent [AI applications](https://github.com/ggml-org/llama.cpp) are becoming popular. 
This means there will be a surplus outdated GPU hardware. These outdated GPUs won't service AI applications, but because of CUDA compatbility they will be able to run your GPU programs just fine. This means your GPU code will become even accessible because of cheaper GPU hardware.

## Developer experience
There are many ways to write and ship a GPU program. [CUDA](https://developer.nvidia.com/blog/even-easier-introduction-cuda/) is the way to write GPU programs but needs writing C++. 
[NUMBA CUDA](https://numba.pydata.org/numba-doc/dev/cuda/kernels.html) and [CuPy](https://docs.cupy.dev/en/stable/user_guide/kernel.html) both allow to write GPU programs in Python. [PyTorch](https://docs.pytorch.org/tutorials/advanced/cpp_extension.html#writing-a-mixed-c-cuda-extension) allows you to wrap CUDA C++ code within Python and execute it.
It is possible to [connect CUDA C++ program to a FORTRAN codebase](https://github.com/tornikeo/tblite-gpu) by using standard bindings. Anything that can connect to C++ can connect to CUDA. You can easily put GPU programs inside a Docker container and deploy it anywhere with a GPU.

## Conclusion

The most computationally expensive programs are usually the most interesting. 
By coding for a GPU, it is possible to make these programs more efficient and accessible. 
A program can be readily shared because GPU hardware is abundantly available and compatible.
GPU programs are becoming more valuable, and more accessible as AI becomes more local. 
It is the best time to learn GPU programming right now, because you can solve real, overlooked problems that fit on a GPU. 
