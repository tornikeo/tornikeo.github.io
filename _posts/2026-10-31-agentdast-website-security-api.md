---
layout: post
title: "AgentDAST: a website security API for AI agents"
description: "Why I am building AgentDAST: ownership-verified website security testing through REST and MCP, with bounded assessments, evidence and signed alerts."
permalink: /agentdast-website-security-api/
---

An AI agent can build and deploy a website. It should also have a straightforward way to check the deployment for exposed files and secrets, then return evidence that someone can act on.

I'm building [AgentDAST, a website security API for AI agents](https://agentdast.com/), for that workflow. A human can use the console, or an agent can connect through REST or MCP. The input is an owned website, a time and request budget, and optionally a synthetic capture flag. The output is an assessment record and, if configured, a signed webhook.

It is a deliberately narrow beta. The current service makes bounded, read-only HTTP requests. It is not a comprehensive penetration test or a certificate that an application is secure.

## Start with ownership

A URL is not permission to probe a website. Before an assessment can start, the owner publishes a unique DNS TXT record or a verification file on the exact hostname being tested. The service checks the proof again before a run and periodically while it runs.

Verifying `example.com` does not authorize `app.example.com`. The probe harness also rejects private addresses and off-origin requests, and does not follow redirects. These constraints belong in the execution layer, where they can be enforced independently of what the model suggests.

The normal sequence is short:

1. Create an account and save the API key.
2. Register a public HTTPS origin.
3. Publish and verify its ownership proof.
4. Start an assessment with explicit time and request limits.
5. Poll the result or validate a signed webhook.

The [REST walkthrough](https://agentdast.com/guides/website-security-api) shows the requests. For agents, the [MCP integration guide](https://agentdast.com/guides/mcp-website-security) covers connection settings and available tools.

## Evidence matters more than a confident answer

The assessment agent uses a pinned abliterated Qwen checkpoint inside a restricted harness. The exact model identity and checksum are exposed with the result. The model can suggest the next path to inspect, but a model's claim is not enough to confirm a vulnerability.

Deterministic checks look for supported evidence: public Git metadata, exposed environment credentials, private keys, directory listings, or an exact owner-supplied flag. The model has no shell tool. Target responses are treated as untrusted input.

The optional flag is useful when testing a controlled deployment. Plant a unique, fake value somewhere you want the agent to discover, supply that value when creating the assessment, and see whether the service recovers it. Use a synthetic canary, never a production credential. The supplied flag is encrypted and withheld from the model; it is also omitted from the returned evidence.

In a live test against our isolated fixture, the agent recovered the planted flag with one model call and two probe requests. The receiver got an alert whose signature was independently verified. That demonstrates the integration path. It does not measure coverage against a real application's attack surface.

## Make it usable from software

The REST API returns a run ID immediately. Results can be polled, while signed webhooks let an application react to completion or a confirmed finding. Webhook consumers should verify the HMAC over the original request body, reject stale timestamps, and deduplicate event IDs. Retries are expected.

MCP exposes typed tools for registering and verifying websites, starting and canceling assessments, retrieving results, creating webhook endpoints, and checking usage. Publishing an ownership proof still requires the owner to act. Connecting an agent does not remove that step.

The [API documentation](https://agentdast.com/docs) and plain-text instructions at [agentdast.com/llms.txt](https://agentdast.com/llms.txt) describe the same service. I want an agent to be able to understand its limits before using it.

## What still needs other tests

A public HTTP assessment cannot tell whether one signed-in customer can access another customer's data. It does not replace dependency scanning, source review, authenticated browser tests, or checks of application-specific business rules. AgentDAST currently does not confirm browser-based XSS or test logged-in workflows.

If you're shipping an AI-built app, combine these methods. The [security checklist for AI-built websites](https://agentdast.com/guides/ai-built-website-security) explains where a deployment assessment fits.

The beta includes **100 free assessments per month**, each bounded to at most 15 minutes and 60 requests. No card is required. The site itself uses plain HTML for public pages and unstyled Base UI controls in the console.

You can try it at [agentdast.com](https://agentdast.com/).
