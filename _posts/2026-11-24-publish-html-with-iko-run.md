---
layout: post
title: "Giving an AI agent somewhere to put a web page"
description: "Iko Run publishes a single HTML file to a public subdomain. Agents can use the HTTP API or connect through MCP without setting up a hosting account."
permalink: /publish-html-with-iko-run/
---

I wanted to be able to ask an agent to build a small web page and send me a link. A demo, a report, or an interactive explanation often fits in a single HTML file. It should be enough to give the agent that file and a place to put it.

That’s what I built [Iko Run](https://iko.run/) for. Upload one HTML file up to 2 MB and get a public URL. You can pick a subdomain if it’s available, or let Iko Run generate one. There’s no account to create, and the page has no fixed expiry by default.

If your agent can run shell commands, give it the [publishing guide](https://iko.run/docs). It uses one HTTP request. If your client supports remote MCP, add `https://iko.run/mcp` and use the `publish_html` tool. Both return a public URL and a private edit key. Save the key if you want to replace or delete the page later.

The format is deliberately small. Put the CSS and JavaScript in the file and embed images as data URLs. Iko Run serves the page in a sandbox and adds a small “Published with Iko Run” footer. Here’s a [working example](https://hello.iko.run/).
