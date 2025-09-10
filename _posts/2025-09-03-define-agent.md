---
layout: post
title: "Define Agent"
description: Define what an AI agent is and what it isn't.
---

I like to use words that are well-defined and broadly understood. "AI Agent" and "Agent" are neither. Below is my best attempt at defining what exactly "AI Agent" means and what it doesn't mean. 

An agent is a program that contains an LLM-conditioned loop structure. Let's define the parts first:

1. A large language model (LLM). An LLM is simply a `def llm(context: str) -> str:` function.
2. A tool. In the context of agents, a tool is a `def tool(input: str) -> Optional[Any]:` function. A tool use can include (on the inside) an LLM or another tool. Some example tools:
    * Conditional tool. This is a `def conditional(input: str) -> bool`.
    * Numeric tool. This can be a `def numeric(input: str) -> int`.
    * Tools can return `None`, pause execution (e.g., sleep), and maintain internal state. 
3. An LLM-conditioned loop. This is a programming loop (e.g. `for`, `while`) where the looping condition depends on the output of the LLM. 

For example, this simple Python program is an agent:

```py
context = '...'
while True:
    output = llm(context)   # llm
    if conditional(output): # Conditional loop, also a `conditional()` tool call
        break
    context += output
```

Another example. In this case, an agent interacts with the user via `print` and `input`: 

```py
context = '...'
while True:
    output = llm(context)
    if conditional(output): # Notice that loop depends on the llm as well as the user
        break
    context += output
    print('context>', output)
    context += input('you>')
```

Let's see some examples of programs that are *not* agents. 

The following program doesn't include an LLM-conditioned loop. It contains a loop, but the loop does not depend on the output of the LLM.

```py
context = '...'
for _ in range(100): # Looping is independent of LLM output
    output = llm(context)
    context += output
    print('context>', output)
    context += input('you>')
```

This final example contains a conditional loop, but the conditional depends on the user, not the LLM. Therefore this is not an agent:

```py
context = '...'
while True:
    query = input('you>')
    if conditional(query):
        break
    context += query
    response = llm(context)
    print(output)
    context += response
```

In fact, this program is a chatbot. The difference between a chatbot and an agent is who controls the looping condition. 

This definition clearly leaves a lot of room for ambiguity. This post is simply the best-effort attempt to put a definition on a word so often said but so rarely understood.

*Thanks to [Ani Talakhadze](https://www.linkedin.com/in/anitalakhadze/) for reading drafts of this*