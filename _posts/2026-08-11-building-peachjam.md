---
layout: post
title: "I'm building PeachJam, an affordable AI app builder"
description: "Why Ani Talakhadze and I are building PeachJam, an affordable way to create and publish websites and web apps by chatting with AI."
---

For the past few months, my co-founder [Ani Talakhadze](https://www.linkedin.com/in/anitalakhadze/) and I have been building [PeachJam](https://peachjam.dev/), an AI app builder for creating websites and web apps by chatting with AI.

The basic experience is simple: describe what you want, watch the app take shape, refine it through conversation, and publish it when it is ready. You do not need to start by choosing a framework, configuring a server, or reading deployment documentation.

This category already has excellent products. [Lovable](https://lovable.dev/) proved that a useful application can begin with a conversation instead of an empty code editor. It also changed what people expect from software creation. A founder, designer, teacher, or small business owner can now build something real without first assembling a traditional engineering team.

I think this shift is as important as the move from assembly to higher-level programming languages. The audience for software creation is becoming much larger.

## Why build another AI app builder?

The short answer is **cost**.

AI-generated software encourages experimentation. You try an idea, see it in the browser, change your mind, and try again. That loop is the whole point, but it can also burn through an expensive usage allowance surprisingly quickly. When every imperfect prompt feels costly, people become cautious at exactly the moment when they should be exploring.

We want PeachJam to make that loop affordable. The product starts free, shows a working preview quickly, and lets people decide when a project is worth publishing. Behind the scenes, we spend a lot of time matching each task with an appropriate AI model and keeping the surrounding infrastructure lean. PeachJam currently runs on [Cloudflare](https://www.cloudflare.com/) and [Hetzner](https://www.hetzner.com/), which gives us a useful balance of global delivery and predictable server costs.

Cheap infrastructure alone is not enough. The app still has to feel coherent. A user should not need to know which model wrote a component, how the preview started, or where the deployment runs. Those are implementation details. The product should feel like one continuous conversation with a competent builder.

## What we are building toward

Our goal is straightforward: PeachJam should let someone move from an idea to a useful published web application without turning AI usage into a financial guessing game.

That means we care about three things:

1. **A fast feedback loop.** A user should see the result, react to it, and continue building without unnecessary setup.
2. **Visible, controlled cost.** The product should help people understand what they can build with their available usage.
3. **A real path to publishing.** A generated project should become something people can share and use, not only a temporary demo inside a chat window.

PeachJam is still in alpha. Some workflows are rough, and we are deliberately working with a small group before opening it more widely. This is the useful stage: real projects reveal problems that no internal checklist can find.

If AI app builders are going to become a normal way to make software, they need to work for people who cannot spend hundreds of dollars testing an idea. That is the bet behind PeachJam.

You can read more at [peachjam.dev](https://peachjam.dev/) or [join the PeachJam alpha](https://peachjam.dev/alpha). If you try it, I would genuinely like to hear what you attempted to build and where the product got in your way.
