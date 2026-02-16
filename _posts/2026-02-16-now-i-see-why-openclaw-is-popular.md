---
layout: post
title: "Now I see why OpenClaw is popular"
---

As a CTO at two young startups (second still in stealth), I'm always hunting for a defensible niche in the AI arms race. We found [OpenClaw](https://docs.openclaw.ai/) via the _vibes_ on X. Basically, OpenClaw is the 'thing' that connects any AI provider to any messaging tool _and_ also allows controlling the computer it runs on. This last part is crucial, because this is what makes it so useful to both startups I work at.

The [first startup](https://mothershipx.dev/) uses OpenClaw in the newly launched [agents](https://mothershipx.dev/agents) feature. This feature simply gives OpenClaw instance with just a few clicks of a button. This is intended for very non-technical users. You just plug in your credit card and you have a 24/7 assistant with a cute workspace, AI credits a selection of data-gathering APIs. Currently the feature is still WIP since we are awaiting a server limit increase from Hetzner.

My stealth startup uses an AI agent as a website _backend_ to modify application state via JSON. The agent tweaks JSON via JQ, [chokidar](https://www.npmjs.com/package/chokidar) picks it up and re-renders the frontend. This is so fast and so surprisingly reliable that I like to [joke](https://www.linkedin.com/posts/tornikeo_agents-ai-ugcPost-7427953626079371265-jcAT?utm_source=share&utm_medium=member_desktop&rcm=ACoAABiuC_ABl0WDGe3Mvk5R6X-WB9xsPAuZ92A) that English is becoming a backend programming language. Before finding OpenClaw, I tried to build a mini equivalent myself — an Express.js websocket server that controls the Gemini CLI. I basically reinvented OpenClaw purely to solve the business requirements. But there were three downsides to the DIY approach:

1. Gemini CLI is locked into Google's ecosystem.
2. Gemini CLI is a coding tool, and we tried our best to cram it into the change management assistant role.
3. Websocket server is brittle and not too secure at best.

OpenClaw is vendor-independent and comes with well-documented ways to connect with chat interfaces, including our custom web-based one. Due to its popularity, I think it will be much more secure and well maintained than what we could ever build and support at a young startup.

That frees us to worry less about infrastructure and more about new features. At [Mothership.dev](https://mothershipx.dev/) we see OpenClaw as a creativity gateway for users (check out the site; it is genuinely cool). At my stealth startup, it lets us resell agentic AI to change managers — a niche domain that didn't yet have their Harvey.ai moment. Across both companies, it gives us vendor independence and a simpler development experience.

I suspect OpenClaw is popular for the same reason we adopted it: most teams building with AI agents end up reinventing the same glue layer — the websocket server, the provider abstraction, the chat interface wiring. OpenClaw just gives it to you, so you can focus on the part that actually matters to your users.