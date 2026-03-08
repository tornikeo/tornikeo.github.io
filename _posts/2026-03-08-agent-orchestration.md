---
layout: post
title: "You don't need complex agent orchestration"
---

## Intro

I don't like complexity. When [steve yegge](https://steve-yegge.medium.com/) published the enormous agent orchestration tool called [gas town](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04), I wanted to try it but was repelled by how freakin complex it is. I don't understand it and I definitely don't want to spend time fixing Gas Town's many issues. I have my own life and work to do.

Unfortunately, at my workplace I still need agents and agent teams to avoid manually QA-ing the apps we build. So, to solve this, I tried the simplest possible approach you can have. Let me show you what that looks like.

## Engineering at mothership
Here's how I efficiently write code and test features at [mothershipx.dev](http://mothershipx.dev/) using [Claude Code](https://claude.ai/). MothershipX is a complex piece of software - it can: 

1. Create agents (using [Hetzner](https://www.hetzner.com/) + [Cloudflare](https://www.cloudflare.com/) + [OpenClaw](https://openclaw.ai/) and [OpenRouter](http://openrouter.ai/))
2. Finance the agent (using [Stripe](https://stripe.com/))
3. Manage the agent, the agent's finances and direction using [Telegram Messenger](https://telegram.org/) and the web dashboard

There are a lot of moving parts that change every day. Testing all this is a lot of manual work, which our small team ([Ben](https://www.linkedin.com/in/ben-meisner/), [Marco](https://x.com/supaborg/) and [me](https://x.com/realtornikeo)) can't provide. The alternative is to use Claude **Cleverly**. 🙂

Let me walk you through a recent example. There's a new feature, called "agent budget", which controls the total expenses an AI agent can make. People can fund this and control the budget. Building this feature requires:

1. Learning current code state
2. Designing new feature (in plain words, no code yet)
3. Writing code
4. Iterating on errors
5. Manually testing on mothership.dev and fixing issues
6. Publishing

Turns out ALL of these steps can be automated with Claude - literally every last one of them **except** the idea and the automation designs. No framework needed. The trick is:

__just ask claude to use subagents for everything.__

Here's how it works: First, write this CLAUDE.md file. Then, start a fresh claude instance with --chrome and --dangerously-skip-permissions. This agent will be the "head" agent. Through it, you divide the work.


```md
# Project Rules

- Work autonomously end-to-end. Backend + frontend + deploy + QA. Never stop at "the API is ready but the UI isn't updated."
- Use subagents (always Opus) for all grunt work. Pair every implementation subagent with a QA/reviewer subagent.
- Work high-level: divide work, subagents execute, you orchestrate and fix issues.
- No AI-generated images ever. Real photos or diagrams only. 
- No buzzwords. Concrete numbers and simple language.
- Use `spd-say` for audible notifications on completion or blockers.
- Keep `REQUESTS.md` updated as the feature backlog. Mark items as you complete them.
- No unnecessary check-ins. Default to action. Full autonomy except no data deletion without asking.
- When done, notify me loudly through accessibility tool (literally make a sound)
```

Initially, I always start with the review part:

```md
Use 3 parallel subagents to dive deep into how money currently moves into and out of the platform, how do we use stripe and how is it connected to agent provisioning? Review and tie-break and compile with 4th subagent and reivew the compiled report afterwards
```

The name of the game is to __conserve the context of the main agent__. The main agent is the one you directly talk to that launches subagents. This is why I always ask the main agent to do the grunt and research work using subagents only. Subagent contexts are disposable, main context is super important.

Next, I load my own idea

```md
claude, I'm thinking on unifying the payments - no more subscription, instead there's a unified budget for the agents that people can fill up and it drains on: vm costs, ai costs, priced api calls, etc. use **3 parallel subagents** to design a low-friction system for our case, given the knowledge of how things work. use 4th compiler to tie-break and compile. then come back to me with a design proposal.
```

There's an interative loop here, I talk to main claude in 3-4 messages, align with my team, align with realities and constraints of the world, and then I start:

```md
Alright claude that sounds good. I want you to launch 3 parallel opus subagents to throroughly plan how to implement this. use 4th subagent to compile and tie-break. Present the plan after it is complete. Encourage the subagents to experiment with things: they shouldn't assume things work and they should do experiments to validate their assumptions under `experiments/` dir.
```

This runs for a while, and then I get to the longest part of the implementation - update code, compile, push, emulate a user in chrome (chrome devtools mcp), come back with frictions and issues and iterate. The name of the game is "DO NOT STOP" and "IF YOU STOP, NOTIFY ME LOUDLY". Here's how I do this:

```md
Alright claude. It's time to divide the plan into parallel pieces and have subagents implement it, in parallel. 

Choose the number of parallel chunks and launch 2 subagents per chunk. One subagent only the updates code, another one only simulates a user, clicking, dragging and dropping things on screen. User subagent must NOT use APIs or bypass the screen. They must really emulate our users and come back with a list of frictions and errors. 

On errors, do not ask me for approval, decide which problem is worth solving, and HAVE SUBAGENTS GO FOR IT. 

Never do grunt iterative work yourself - you are the manager and you MUST conserve your context. Use subagents for all the grunt work and ALWAYS check subagent's work with another subagent.

Go, and ONLY notify me with sdp-say after all the problems are fixed and subagents don't report any more meaningful errors/frictions.
```

As this is running, I am doing other things.  Often leaving my laptop to help out with household tasks, doing dishes, talking to my partner, doing human things - when claude is really finished, they notify me with a loud robotic voice: `spd-say "Tasks done, QA complete, issues fixed. Ready for review!"`. 😁 


## Closing thoughts

That's it. No orchestration framework, no config files, no dependency graph. Just prompts that tell claude to divide work, use subagents, and not stop until it's done. Gas Town-level coordination from a few understandable paragraphs.

Before 2025, programming was somewhat similar to [factorio](https://factorio.com/). You automate stuff, you become faster, and things accelerate. Right now, the programming __is__ the game of factorio. Automation is key and clever automation design will get you very, very far if you are willing to experiment and improve.

![alt text](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/how-i-vibe/factorio.png)