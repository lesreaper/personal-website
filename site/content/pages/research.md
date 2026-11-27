---
title: "Intelligence under constraint."
eyebrow: "Deep SIML Labs / Research"
description: "What should an agent remember when it has little memory, little energy, and a world that keeps changing? I began working on SIML in 2024 with that question. It is still a good place to start."
---

## Learning from surprise

An early agent moved through a simulated world with a small store of memories. When an observation departed from its prediction, the agent could revise what it remembered. This gave me a place to explore an idea drawn from the Free Energy Principle (FEP) and a practical engineering question. Which changes actually help the agent act? [Original agent demonstration](/research/siml-demo)

In a later experiment, a one-bit signal helped a frozen V-JEPA 2 planner choose movements toward a single target. In the lab’s 100-episode comparison, the mean final reaching error fell from 0.193 metres to 0.109 metres with the same planning budget. Per-step latency fell from 2.28 to 1.13 seconds. The energy estimate applies to that setup. [Planner benchmark and conditions](/research/siml-fepgate-vjepa2)

## What fits in memory

By 2026 the unit of inquiry could be as small as a bit. On a single RTX 3060, a packed representation updated 256 independent binary lattices of 32³ sites at 12.08 times the rate of the tuned UInt8 CUDA baseline while the data stayed on the GPU. For 32 smaller lattices of 8³ sites, the ratio fell to 0.871. At that size the baseline was faster. [GPU study and limitations](https://www.siml.life/research/siml-gpu-capability)

In a separate computational biology study, the lab advanced 8,100,736 simulated cellular signaling patches through six simulated seconds, compared with 6,022,368 for the Triton baseline under the same 6 GB memory ceiling and accuracy constraints. Both GPU studies are lab reports awaiting peer review. [Cellular simulation study](https://www.siml.life/research/siml-cuda-cell-capacity)

## Where the questions lead

Informational geometry asks when the arrival of a signal changes a network’s eventual state. SIML Studio explores another question about representation. How much data can we remove in transit and still recover the specified information at the other end? Its beta checks byte counts and round trips. Energy savings would require a hardware measurement. [Causal geometry preprint](/research/dynamic-causal-geometry) · [SIML Studio](https://www.siml.life/studio)

The next step reaches beyond software. The Replicant direction starts with a biological function, such as muscle shortening under load, and asks whether a different physical system could perform it. Ionogel, electro-fluid systems, and other substrates are candidates for investigation. The published materials work documents reference simulations. Testing physical samples against biological measurements is ahead. [Biological reference systems](https://www.siml.life/biological-systems) · [Materials research](https://www.siml.life/materials) · [Current priorities](/now)
