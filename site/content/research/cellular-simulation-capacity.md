---
title: "SIML CUDA vs. nVidia Triton for Large Scale Cellular Simulation"
slug: "cellular-simulation-capacity"
category: "research"
kind: "White paper"
date: "2026-11-18"
dateLabel: "November 18, 2026"
status: "Lab benchmark · not peer reviewed"
summary: "How many interacting patches of a cellular signaling model can fit inside a fixed GPU memory allowance?"
topics: ["Simulation", "Scientific computing", "Biological modeling"]
role: "Research lead and publisher"
authors: ["Deep SIML Labs"]
sources: [{"label": "Original study, accuracy checks, and limitations", "url": "https://www.siml.life/research/siml-cuda-cell-capacity"}]
related: ["gpu-lattice-updates", "deep-siml-labs"]
---

## A memory budget for a model

Two implementations ran the same signaling model under a 6 GB limit. SIML CUDA fit roughly two million more interacting patches than the Triton baseline while meeting the study’s numerical checks. The result establishes capacity for this six-second simulated interval on one RTX 3060.

The published record gives the runtime and peak memory as well as the modeled population. Whether a simulation predicts the response of living tissue calls for a comparison with biological measurements.
