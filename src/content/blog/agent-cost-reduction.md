---
title: "How I cut agent pipeline cost by 65%"
description: "Where the waste actually lives in a production multi-agent system — and how to fix it."
date: "2025-05-20"
tags: ["agents", "llm", "production"]
draft: false
---

Most teams instrument their agents wrong. They focus on the model — which model, which temperature, which prompt. That's the last 10% of the cost problem. The first 90% lives somewhere else entirely.

## Where I started

At Cactus Communications, we had a multi-agent pipeline running in production. It worked. It was accurate. And it was expensive — more expensive than it needed to be by a significant margin.

The natural instinct is to blame the LLM calls. Swap GPT-4 for something cheaper, reduce max tokens, cache responses. We did some of that. It helped, but not dramatically.

The real savings came from somewhere less obvious.

## Where the waste actually lives

**1. Agents doing work that doesn't need an agent**

The first thing I audited was which steps in the pipeline actually required LLM reasoning — and which ones were just using an LLM because it was convenient. Classification tasks that could be a regex. Routing decisions that could be a lookup table. Formatting steps that could be a template.

Every time you replace an LLM call with deterministic logic, you eliminate cost entirely — not reduce it, eliminate it.

**2. Context window bloat**

Each agent in our pipeline was receiving the full conversation history plus retrieved documents plus system instructions. Most of that context was irrelevant to what that specific agent needed to do.

We started being surgical about what each agent received. Intent detection agent gets the query and nothing else. Retrieval agent gets the structured intent output. Summarization agent gets the retrieved chunks, not the raw history.

Smaller context = fewer tokens = lower cost. And often better outputs, because the agent isn't distracted by irrelevant information.

**3. Unnecessary retries**

Our error handling was set up to retry on any failure. Reasonable in theory. In practice, it meant a hallucination or a malformed output triggered an automatic retry — same context, same model, often same bad result. We were paying twice (or three times) for failures.

The fix: classify errors before retrying. Transient errors (rate limits, timeouts) → retry. Quality errors (wrong format, low confidence) → route to a fallback path, not a retry.

**4. Orchestration overhead**

Every agent call had overhead: context assembly, response parsing, validation. We were doing this sequentially even for agents that could run in parallel.

Moving to parallel execution where possible — intent detection and initial retrieval running simultaneously — cut wall-clock time significantly and reduced the cascading retry problem.

## The actual numbers

Across these four changes, we reduced operational cost by 65% and processing time by 80%. In concrete terms, **per-request cost was roughly $0.03–$0.04** at the peak of the old design; after the changes it settled around **$0.017–$0.023** per request (depending on path and payload). The model spend was maybe 20% of the total savings. The rest was orchestration, context management, and eliminating unnecessary calls.

The lesson: if your agentic system is expensive, the LLM is probably not the problem. Audit what's actually happening between the calls.

---

*Currently building more agent systems independently. If you're working on something in this space, [get in touch](/contact).*
