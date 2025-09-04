---
layout: post
title: "Define Agent"
description: Define what an AI Agent is and what it isn't.
---

I like to use words that are well-defined. "AI Agent" and "Agent" are words that I often encounter, but I feel are not well-defined. This is what I think when I hear the word "Agent".

An AI Agent is a program with an llm-conditional loop structure. This program must contain the following parts:

1. A large language model (LLM). An LLM simply is a `def llm(context: str) -> str:` function.
2. A tool. In context of Agents, a tool is a `def tool(input: str) -> Optional[Any]:` function. A tool use can include calling an LLM or another tool as a sub-step. There are different tools:
    * Conditional tool is a `def conditional(input: str) -> bool`.
    * Numeric tool is a `def numeric(input: str) -> int | float`.
    * Tools can return `None` or just wait, or simply do nothing.
3. An llm-conditional loop is a program loop where the looping condition depends on the output of an LLM.

For example, one of the most basic agent is the following:
```py
context = '...'
while True:
    output = llm(context)
    if conditional(output):
        break
    context += output
```

The agent could include a tool that interacts with the user `print()` or `input()`:

```py
context = '...'
while True:
    output = llm(context)
    if conditional(output):
        break
    context += output
    print('context>', output)
    context += input('you>')
```

Below are examples of programs that look like agents, but are *not* agents by this definition:

Programs that do not include an llm-conditional loop. The loop condition is `range(100)` does not depend on the output of an LLM. For instance:

```py
context = '...'
for _ in range(100): # Looping is independent of llm output
    output = llm(context)
    context += output
    print('context>', output)
    context += input('you>')
```

Programs that do not contain an `llm` function. I don't consider `llm` *output quality* to be a determinator. An `llm` can be as simple as:

```py
def llm(context: str) -> str:
    return "I'm a teapot."
```

This how  AI Agent is defined. When I say or read the word "Agent", "Agentic AI", "LLM Agent", this is what I think it means. 

*Thanks to [Ani Talakhadze](https://www.linkedin.com/in/anitalakhadze/) for reading drafts of this*