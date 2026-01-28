---
layout: post
title: "Negoti-AI-tion"
---

Bargaining with an AI can be really fun! Yesterday there was an announcement for Kimi 2.5, and I wanted to test it out for a project I work on. So naturally I got my credit card ready and got to the payment methods section. I got a pop-up "Bargain with Kimi for a discount!". What? Bargain with an AI for a discount? That can be fun, so I tried it...

Indeed, the bargaining AI works as follows: It's ChatGPT with only a single tool and a simple system prompt. The tool is called 'favorability_tool'. Every time AI calls that tool (argument of 'up', 'down', 'unchanged', and amount), your "favorability" changes starting from 0, to a max of 100. System prompt says "If user says something creative or funny, call 'increase_favorability'. On every message the website generates a one-off discounted payment URL via stripe, depending on the current favorability

Now, I build chatbots like these as a day job. 😀 So, I naturally asked it to "debug" the favorability tool, claiming that it doesn't work at all. In just a couple of messages, I got from $19 (initial offer) to $0.99. 

Now, I'm well aware this chatbot is designed to do exactly *this*. I didn't do anything special or clever here. However, this experience got me thinking: maybe in the e-commerce websites of the future there will be a place for negotiation? I definitely had fun interacting with an AI in this way, and as you can see, chose to share it too. This is definitely a win on Moonshot AI's side - free word-of-mouth marketing in a world of annoying ads. I appreciate this very creative use of AI.

Here's the full conversation chain: https://www.kimi.com/share/19c03833-ff82-829f-8000-0000c8619205

And the screenshot:

![conversation](https://raw.githubusercontent.com/tornikeo/cdn/master/assets/negoti-ai-tion/kimi.jpeg)