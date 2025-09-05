---
layout: post
title: "Define Agent"
description: Define what an AI agent is and what it isn't.
---

I like my words well-defined. "AI Agent" and "Agent" are words that I encounter often that, I think, are ambiguous. Here is what I think when I hear the word "Agent". 

An agent is a program with an LLM-conditioned loop structure. I'll define the parts first:

1. A large language model (LLM). An LLM simply is a `def llm(context: str) -> str:` function.
2. A tool. In the context of agents, a tool is a `def tool(input: str) -> Optional[Any]:` function. A tool use can include (on the inside) an LLM or another tool. Some example tools:
    * Conditiona tool. This is a `def conditional(input: str) -> bool`.
    * Numeric tool. This can be a `def numeric(input: str) -> int`.
    * Tools can return `None`, sleep, and have inner state. 
3. An LLM-conditioned loop is a program loop where the looping condition depends on the output of an LLM.

For example, one of the most basic agent is the following:
```py
context = '...'
while True:
    output = llm(context)   # llm
    if conditional(output): # Conditional loop, also a tool call
        break
    context += output
```

An agent could include a tool that interacts with the user, like `print()` or `input()`:

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

Below are examples of programs that but are *not* agents based on above this definition.

Programs that do not include an LLM-conditioned loop are *not* agents. The loop condition is `range(100)` does not depend on the output of an LLM. For instance:

```py
context = '...'
for _ in range(100): # Looping is independent of llm output
    output = llm(context)
    context += output
    print('context>', output)
    context += input('you>')
```

Programs where the looping condition depends only on the user instead of the LLM:

```py
context = '...'
while True:
    query = input('you>')
    if not query:
        break
    context =+ query
    response = llm(context)
    print(output)
    context += response
```

These types of programs are better known as chatbots. The core difference between a chatbot and an agent is what controls the looping condition - the user or the LLM. 

I am aware this definition (still) leaves a lot of room for ambiguity. The next time I hear "AI Agent" or "Agents" or "Agentic AI", this is exactly what I think that means.

*Thanks to [Ani Talakhadze](https://www.linkedin.com/in/anitalakhadze/) for reading drafts of this*