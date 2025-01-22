---
layout: post
title: Daily scribbles - on choosing right LLM shapes for GPUs
categories: daily-scribbles
---

A100 memory hierarchy - what's are "perfect" model shape for A100?
A100 memory hierarchy - what's are optimal transformer shapes for NVIDIA GPUs?

There's a thing called [vLLM](https://github.com/vllm-project/vllm). Inference and serving engine for LLMs.

vLLM was built around **PagedAttention** algorithm. Introduced in [paper](https://arxiv.org/abs/2309.06180). What's a **KV cache**?

> KV cache. This is a method for better inference performance. From [HF](https://huggingface.co/blog/kv-cache-quantization). When you are generating long text, a typical autoreg transformer will predict a token by looking at all previous 999 tokens. Then it will predict next token, by looking at previous token and previous 999 tokens. Maybe older tokens could be reused somehow?

![](https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/kv_cache_quantization/kv-cache-optimization.png)

Basically, queries grow downwards (new token = new row), and keys grow leftwards (new token = new column), and values also grow downwards (new token = new row). For processing new token, we only need last row of Q, but full K, V, due to how matrix multiplication works. *But*, we can simply restore previous K, V, instead of re-computing them. Extra memory, but less compute. 

> PagedAttention explained on [HF](https://huggingface.co/docs/text-generation-inference/en/conceptual/paged_attention), is a method for inference performance. It optimizes the KV cache, by using lessons from how OS hanldes memory Paging. 

Amazon's LLM, rufus was cooked up on top of vLLM.

vLLM supports models up to scale of 405B params, LLAMA 3.1.

Serving is simple `pip install vllm` and `vllm serve meta-llama/Llama-3.1-8B`. 
As a python package `vllm` has a simple-ish programming API for querying models. 

Back to original article.

**Mixture of Experts**? **Speculative Decoding**?

There's the claim: "the most foundamental fact that transformer inference is memory bound". Let's see.

===

Preliminaries. GPU memory architecture. A100 80GB SXM has 108 Streaming multiprocessors (SMs), 40MB L2 cache.

When doing inference i.e. `model.generate(prompt)` these things happen:
1. Load layer matrices from HBM to L2 to SM.
1. Do matmul, and use tensor cores

Loading part takes much longer than tensor core part.

Suppose we have A100:
- 108 SM, DRAM 80 G, 40M L2 cache
- bf16 tensor core: 312 tflops
- DRAM mem bw, 2.039 TB/s

If model is larger than 80GB, it's split up:
- Connection by NVLink 300GB/s = 0.3 T/sec

See the problem? 312 TFLOPS >> 2.03 TB/s >> 0.3 TB/s  >> 0.006 TB/s 

This seems to show that memory is the main bottleneck. Or is it?

A100 prefers doing 312 operations per each 2.039 loaded bytes. How on *Earth* can you do 312 operations for approximately 2 bytes?

The matrix multiplication with 2 N-square matrices, has arithmetic intensity proportional to N. Therefore, larger matrix sizes might actually be compute bound. This also means that there's some sweet-spot matmul size that the GPU likes most. 

This also means that any op that is elementwise (e.g. activaions) will always be memory bound. For example:

- `nn.Linear(1024, 4096)`, batch size 512, is compute bound
- `nn.Linear(1024, 4096)`, batch size 1, is memory bound

**Kernel fusion** works between an `nn.Linear` and a `nn.Relu`, or any other activation. Since activation is mem bound, and elementwise, we can immediately apply relu inside CUDA kernel, before returning output to HBM. 

Aha. Interesting bit. About online inference. Throughput vs latency:
- Offline: if we are evaluating the model (offline), and no user waits at the end of the screen, we should increase batch size.
- Online: if user is waiting, the optimal speed to generate next token is the average human read speed, in tokens. Otherwise human might complain.