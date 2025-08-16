---
layout: post
title: "Thesis and you"
description: Practical advice on writing tech thesis
---

My [thesis](https://urn.fi/URN:NBN:fi-fe2025063075583) was tough to write. "On graphics processing units for simulation of mass spectra" can be summarized in this single image:

![Chem + GPU = x250 faster](https://github.com/tornikeo/cdn/raw/master/assets/thesis/speedup.png)

The first tool ([xTB](https://github.com/tblite/tblite)) simulates how molecules work. It a really useful tool for chemists! But, it can be *really* slow. The second tool is a [graphics processint unit, a GPU](https://www.youtube.com/watch?v=h9Z4oGN89MU). A GPU is a computer that makes video games and AI run faster. When I started writing the thesis, I had just recently [published a paper](https://academic.oup.com/bioinformatics/article/41/3/btaf081/8026685) with a similar recipe: `Some obscure chemistry tool + GPU = x1000 speedup`. I was hoping to get something similar in the thesis as well. Unfortunately, I underestimated just how complex `xTB + GPU` combination would turn out. So, this is my first practical advice:

## Work backwards
If you are like me aiming for an industry job and looking to find a good thesis topic, do this:

- Search for job positions you'd love to have.
- Summarize the requirements (key technologies and "preferred" experiences)
- Come up with a thesis **title** that if shared with the recruiter, would (in your mind) make 
    you the  **perfect candidate** at most of those jobs.

### Example

Say you like these two job postings:

![Two job posts](https://github.com/tornikeo/cdn/raw/master/assets/thesisg-guide/jobs.png)

You take out a list of properties that your upcoming thesis project *must* have:

1. Must have a Python part.
2. Must provide a Python `pip` package *and* an online website hosted using AWS.
3. Must use a vector database, with some sort of tool calling, and built with LlamaIndex on top of OpenAI API.
4. Must have to do something with Property Management Tools like [TenantCloud](https://app.tenantcloud.com/) or [Buildium](https://www.buildium.com/).


## *Over*estimate the difficulty

Whatever you do, always overestimate the difficulty of the thesis. For example, start with this plan:

1. Week 1: Literature review
2. Week 2-4: Coding
3. Week 5: Writing

Then overestimate difficulty:

1. Week 1-2: Literature review
2. Week 2-10: Coding
3. Week 10-12: Writing

This exercise is useful, because in my experience this is exactly what happened. I estimated the timeline and really underestimated difficulty. This was because I didn't know much about the project beforehand.

## Guarantee a positive outcome

Your prof might be OK with a non-positive outcome. You might find out that a tool you are building sucks and there's no way to un-suck it. You have to find a different representation of the tool. 

<!-- TODO: Talk about Tblite-gpu failure and re-representation -->

## Use AI well

AI is really good at providing an on-demand, 3rd person view. It is also very good at catching silly text mistakes. Text requires many iterations, so it is **not** a good idea to keep copy-pasting stuff into chatgpt.com all the time. Instead, use an IDE, like VSCode and use a Github Copilot chat. 

<!-- TODO: Add a short gif/video of selecting editing into chatbox -->

## Use Images as much as possible

People absolutely *adore* images. For example, look at this image below, it describes how the binary files are connected to each other to make my project run:

![FORTRAN + CUDA connections](https://github.com/tornikeo/cdn/raw/master/assets/thesis/tblite-gpu-flow.png)

Does this tell you everything? Hell no, but everyone absolutely loved it. I don't know why. Use a simple image editor - I used [exaclidraw](https://app.excalidraw.com/) for these.

## Conclusion

Be pragmatic in your thesis. Thesis is a 6 month commitment and you have to cash in on it. The best thesis is the one you can link to in a job application. The more it fits, the better it is. 