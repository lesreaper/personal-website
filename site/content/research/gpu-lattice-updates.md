---
title: "Large-Scale Binary Gibbs Updates on a Commodity GPU: Measured Capacity and Throughput"
slug: "gpu-lattice-updates"
category: "research"
kind: "White paper"
date: "2026-11-14"
dateLabel: "November 14, 2026"
status: "Lab benchmark · not peer reviewed"
summary: "A comparison of two ways to store and update binary lattices on a single graphics card."
topics: ["Simulation", "Scientific computing", "Representation"]
role: "Research lead and publisher"
authors: ["Deep SIML Labs"]
sources: [{"label": "Original study, timing table, and limitations", "url": "https://www.siml.life/research/siml-gpu-capability"}]
related: ["cellular-simulation-capacity", "dynamic-causal-geometry", "deep-siml-labs"]
---

## Counting the work

Keeping data on the graphics card lets a researcher time the update itself. On an RTX 3060, SIML’s packed implementation was faster than the tuned UInt8 baseline on 256 lattices of 32³ sites. On 32 lattices of 8³ sites, the baseline won. The published table gives timings at each size and the uncertainty across paired runs.

Transferring a dataset and reading it back also take time. Those costs belong in a separate comparison of how long an entire application takes.
