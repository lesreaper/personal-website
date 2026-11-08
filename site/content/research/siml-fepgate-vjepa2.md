---
title: "One bit to rule the planner: SIML FEPGate + V-JEPA 2"
slug: "siml-fepgate-vjepa2"
category: "research"
kind: "Benchmark"
date: "2025-10-15"
dateLabel: "October 15, 2025"
status: "Reported benchmark"
summary: "A lab experiment coupling a one-bit surprise gate to a frozen latent planner."
topics: ["Embodied AI", "World models", "Efficiency"]
role: "Author and researcher"
authors: ["Richard Everts"]
sources: [{"label": "Benchmark report", "url": "https://www.siml.life/research/VJEPA2-siml-fepgate"}]
featured: true
related: ["from-pixels-to-predictive-codes", "deep-siml-labs", "how-minds-get-small"]
---

## A small intervention in the planning loop

This experiment adds a SIML surprise signal to the candidate-selection loop of a frozen V-JEPA 2 planner. The encoder and predictor are left unchanged; the intervention operates on planning candidates rather than retraining the model.

The lab reports comparisons of final reaching error, per-step latency, and estimated energy use under the same planning budget. The method, setup, and implementation links are available in the original report.

## How to read the result

These are reported lab measurements from a particular experimental setting, not an independently replicated claim about all world models. The interesting research question is whether a compact feedback signal can help a planner use computation more selectively.

The experiment extends the earlier technical note on predictive representations and forms part of Deep SIML's continuing work on simulation and efficient decision systems.
