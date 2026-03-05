---
layout: post
title: "Docs considered harmful"
---

I maintain two production codebases [MothershipX](https://mothershipx.dev/) and a change management SaaS. Both are built entirely with agentic coding (Claude Code). Internal documentation rots faster than grapes in summer. I feel like docs are actively harmful because agents (as far as I can see), really only read code.

## The doc rot

One of my projects started as a simple Docker-based agent runner with a CLI. The README still describes that architecture. The actual codebase is now a complex app with Next.js, Express backend, OpenClaw gateway, PostgreSQL, Hetzner deployment and a thousand other things. The README still talks about `./scripts/build-agent.sh` and `./scripts/run-dev.sh`. Neither of those files exist anymore.

The CLAUDE.md is worse. It has a "Critical Rule #4" that says: _"Never create new WebSocket connections from components -- use the singleton in `lib/websocket.ts`."_ Sounds authoritative. Except the file is actually called `useAppWebSocket.ts`, it's a React hook, and it uses `react-use-websocket` with `share: true`. Docs are wrong and they are harmfully wrong. They mislead the tools we use to write new features.

MothershipX has similar issues. CLAUDE.md references `provision-agent/index.ts` at the project root. The actual file lives at `supabase/functions/provision-agent/index.ts`. The docs describe `.env.secrets.local` as a symlink to `../secrets/.env.secrets.local` -- a directory that isn't tracked anywhere. The README still has `https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID` as a placeholder. Nobody filled it in and nobody ever will.

## Why this happens

When you're building with Claude Code, the codebase changes _fast_. That project went from a Docker CLI wrapper to production in days. 10s of beefy commits per day changing, moving files, renaming modules, swapping libraries. The code changes as quickly as the bits of a binary executable that lives at the pointy end of `gcc -o`.

Docs just can't be both usefully descriptive AND up to date. You can't just have it. You can have rough guidelines, vision, e.g. we are building on hetzner, we have docker (say hello!), we have react and such and such. But if you say anything below that, it rots _fast_. 

The result is that by the time someone (or some agent) reads the docs, they're actively misleading. The agent reads "use the singleton in `lib/websocket.ts`", dutifully looks for that file, doesn't find it, and starts _creating_ it reintroducing an old pattern that was deliberately removed. The docs didn't just fail to help; they caused a regression.

## What docs actually work

The only docs I've found that hold their value are for _external_ dependencies that don't change. MothershipX has a `docs/llms/` folder with cached documentation for OpenClaw, Next.js, Drizzle, Playwright, Zustand, and others. These are stable APIs. They don't mutate every commit. They're genuinely useful. **Except** openclaw, because it is super unstable - the only way to use openclaw is to clone the repo and have claude read the tests **AT THE RELEASE TAG** that we use. Docs are almost completely useless with openclaw.

Everything else, paths, small decisions, "critical rules" have a half-life of days in an agentic codebase.

## A possible fix I haven't tried

one idea I keep coming back to: make doc updates a hard CI requirement on every commit. some check that diffs changed files against what's referenced in CLAUDE.md and blocks the merge if there's a mismatch. you renamed `lib/websocket.ts`? cool, now update every doc that mentions it or the build fails.

I haven't built this. it might work. it might also become the most annoying CI check ever and get `--no-verify`'d into oblivion on day two. I honestly don't know. the problem is that docs are a second copy of truth, and keeping two copies of anything in sync is... well, that's basically the hardest thing in programming, isn't it.

for now I do this: cache `llms.txt` files for external deps aggressively, don't document internal stuff that changes faster than monthly, and when in doubt just make the agent read the actual code. it's slower but at least you're not feeding it lies from three weeks ago.
