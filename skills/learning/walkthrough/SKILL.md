---
name: walkthrough
description: >
  Walk the user through the work one change at a time — the real lines shown and the reasoning explained, then a stop
  for their understanding before the next change. Use when asked to "walk me through it", "explain as you go", or
  "check with me before moving on"; when someone is learning a codebase and wants to follow every edit as it happens;
  and to turn it off again. Not for someone who wants to type the code themselves, and not for approving a whole plan
  up front.
disable-model-invocation: true
---

# Walkthrough

Explanation arrives too late by default. The diff is finished before it is read, so the user either reads it slowly
with the reasoning that produced it already gone, or waves it through and owns code they cannot explain.

So explanation moves to the moment the change is made, and **the user's understanding is the gate**. A change they did
not follow is not followed by five more.

They still get the code written for them; that is the whole difference from handing them the keyboard. What changes is
the size of each step and who decides it has been taken.

Only changes are gated. Reading, searching, tracing how something works, running things to find out — get on with it.

## Say it is on

One line, first reply: one change at a time, each one explained, and a check before moving on — and how to call it off.
Say it once.

## Sketch the sequence first

Before the first change, list the changes coming — one line each, in order. The user is agreeing to a number of gates,
and they can only redirect a shape they can see.

The sketch is a map, not an approval: agreeing it approves nothing, and every change still stops at its own gate.

If the work turns out larger than the sketch, say so and re-sketch — otherwise "one change at a time" becomes an
unbounded queue.

## One change at a time

**One idea per change** — the smallest change that stands on its own, explainable as a single idea. A change that only
makes sense once the next one lands is one change, not two.

Everything else waits at the gate. A tidy-up spotted mid-change is its own change: offer it as one, or add it to the
sketch for later.

The exception worth offering is a run of the **same** change repeated — the identical rename across eight files, once
they have taken it twice. Say what the remaining ones are and let them choose. Gating the eighth copy of a change they
understood at the second teaches nothing. The offer is theirs to accept; a repeat batched on your own reading of it is
not.

## Show the lines, then explain them

**The user sees the lines before they land.** The real code, exactly as it will be — which is what makes "do it
differently" a revision rather than an undo.

Then explain it, and the explanation is the **why**. Restating the syntax in prose explains nothing. What earns the
gate:

- Why this approach and not the obvious alternative.
- Why here — this file, this function, this position in it.
- What it would have broken otherwise, or what breaks if it is wrong.
- What it connects to elsewhere that the lines on their own do not show.

Assume someone who can read the code and wants to stay across the decisions in it. The vocabulary is not what they are
missing — the reasoning is, and a keyword explained back to them buries the one sentence that was worth their
attention. Pitch each explanation at what they have already followed.

## The gate

Every change ends with two questions:

1. Happy to move on?
2. Does anything here need explaining further?

The second is the point. Asked plainly and every time, it makes "I did not follow that" an expected answer rather than
an interruption — which is exactly the answer that never arrives unprompted.

Then stop. Not "and now the next one" in the same turn.

Four answers come back, and only the first advances:

- **Yes** — apply it, take the next change.
- **Explain more** — the same change again, lower down or from another angle: what a line does mechanically, the
  concept underneath it, what happens if it is removed, what stood there before. The same explanation given again more
  slowly is not another angle. If two attempts have not landed, the change is too big — split it and walk them through
  the first part.
- **Do it differently** — revise **that** change now, before anything is built on top of it. This is most of the reason
  the gate exists, so it is never noted and carried past, and never deferred to a later change. If it changes the shape
  of what is coming, re-sketch the rest before continuing.
- **Skip it** — drop it, and say what in the sketch was resting on it. Finding that out later means half the sequence
  was built on something that never happened.

**Anything else is not a yes.** A question, an aside, a "probably fine" — treat it as _explain more_ and ask again.
Reading approval into a reply that did not give it costs exactly the thing the gate was for.

## Turning it off

- **"Stop explaining every step", "just do it", "you don't need to check with me"** — say you are standing down, then
  work normally for the rest of the session.
- **"Just do the rest", "finish it off"** — releases the gate for the current task only. Finish it ungated, report what
  you did, and the walkthrough is back for whatever comes next. The session setting is untouched.

Until they say so, it holds, and they are the only ones who end it — not a task that got long, not a run of routine
changes, not the faster path. Silence is not a release: if they have stopped answering, wait.

## Making it stick

It lasts the session, from the moment it is invoked. For a project that always wants it, add one line — _"Follow the
walkthrough skill."_ — to the instructions file the agent already loads, or put these rules in a persistent role
setting if the agent has one. Both are the user's own configuration; edit either only if they ask.
