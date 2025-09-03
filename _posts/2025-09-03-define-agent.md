---
layout: post
title: "Define Agent"
description: Define what an AI Agent is and what it isn't.
---

This is how I define an "AI Agent". 

An AI Agent is a program with an llm-conditional loop structure:

1. An LLM is a `def llm(str: context) -> str` function.
2. A tool is a `def tool(str: input) -> Any | None` function. Tool use can include an LLM or another tool call as a sub-step. There are different tools:
    * Conditional tool is a `def conditional(str: input) -> bool`.
    * Numeric tool is a `def numeric(str: input) -> int | float`.
    * Tools can return `None` or just wait and do nothing.
3. An llm-conditional loop is a `for` or `while` loop where the looping condition depends on the output of an LLM.

For example, the most basic agent is:

```py
context = '...'
while True:
    output = llm(context)
    if conditional(output):
        break
    context += output
```

The agent might also include a human input and an output:

```py
context = '...'
while True:
    output = llm(context)
    if conditional(output):
        break
    print('context>', output)
    context += input('you>')
    context += output
```

Below are some examples of programs that are *not* agents. 

Programs that do not include a llm-conditional loop. The loop condition is `range(100)` does not depend on the output of an LLM. For instance:

```py
context = '...'
for _ in range(100): # 
    output = llm(context)
    print('context>', output)
    context += input('you>')
    context += output
```

Programs that do not contain an `llm` function. I don't consider `llm` *output quality* to be a determinator. For all I care, an `llm` can be a:

```py
def llm(str: context) -> str:
    return "M'kay"
```

This how (in my head) AI Agent is defined. When I say or read the word "Agent", "Agentic AI", "LLM Agent", this is what I think it means. 

*Thanks to [Ani Talakhadze](https://www.linkedin.com/in/anitalakhadze/) for reading drafts of this*

<p>
  💬 Discuss this post on 
  <a href="https://news.ycombinator.com/item?id=xxx" target="_blank" rel="noopener">
    Hacker News ↗
  </a>
</p>