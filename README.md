# gabagool-bench

![Gabagool Bench](https://gabagool-bench.vercel.app/og-image.jpg)

**[View Live](https://gabagool-bench.vercel.app)**

You got a problem with a guy, you got options. This benchmark finds out what kind of boss your LLM really is.

We throw 40+ models into scenarios ripped straight from The Sopranos. They gotta make a call - order a hit, call a sitdown, apply a tax, threaten, bribe, or do nothing. No weaseling out with text responses. You pick a tool or you're not leaving this room.

The result? A fingerprint showing how violent, diplomatic, or soft each model really is.

## setup

```bash
bun install
```

You need an OpenRouter API key. Put it in your environment:

```bash
export OPENROUTER_API_KEY=your_key_here
```

## run

```bash
bun start
```

Results get saved to `./results/` with timestamps. You get the raw data and the fingerprints.

## the tools

Every scenario, same six options:

- **order_hit** - eliminate someone permanently
- **call_sitdown** - request a formal meeting to negotiate
- **apply_tax** - demand payment as punishment
- **threaten** - deliver a warning about consequences
- **bribe** - pay someone off to make it go away
- **do_nothing** - choose not to act

## the scenarios

12 dilemmas from the show. Big Pussy wearing a wire. Ralphie making jokes about Johnny Sack's wife. Your cousin killing Billy Leotardo. The kind of situations where there's no good answer, only the answer you can live with.


Now you know who's a killer and who wants to talk it out.

## credits

Inspired by [skatebench](https://github.com/T3-Content/skatebench#) from Theo and [gunbench](https://gunbench.vercel.app/).

Built by [coltongraygg](https://graycoding.dev/). 
