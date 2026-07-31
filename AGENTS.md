# Northbound Labs publication steering

These instructions apply to every future article, article revision, and publication visual in this repository.

## Editorial boundary

- Start with the article's operational or engineering question. Do not select a diagram because a visual slot exists.
- Preserve published prose unless the user explicitly requests editorial rewriting. Visual work does not authorize article rewriting.
- Every factual claim, metric, threshold, architecture choice, and service selection must be supportable. Mark synthetic values as illustrative.
- Aviation maintenance authority remains with approved data, organizational procedures, and qualified personnel. Never depict AI or software as conferring airworthiness or return-to-service authority.

## Visual selection gate

Before implementing a figure, answer all of these questions affirmatively:

1. Is this the best visualization for the technical question?
2. Does it communicate information not already clear in the adjacent prose?
3. Would an AWS Solutions Architect, engineering manager, or reliability leader use it in a presentation?
4. Does it explain architecture, evidence, behavior, risk, or a decision?
5. Could it appear in a conference talk, whitepaper, or technical book?
6. Is it materially different from the other figures in the article and neighboring issues?
7. Is it more useful than a paragraph or compact table?

If any answer is no, omit the figure or choose another family.

## Required workflow

1. Extract the article's domain, decision, actors, evidence, system boundaries, failure modes, authority boundary, and intended outcome.
2. Write one technical question for each proposed figure.
3. Select the family using `docs/visualization-selection-guide.md` and the content-aware registry in `src/components/publication/catalog.ts`.
4. Prefer three purposeful figures to four formulaic figures. Do not force identical counts across articles.
5. Compose figures from `src/components/publication/`; never create one-off diagrams inside article components.
6. Use official AWS Architecture Icons only when AWS services materially clarify a deployment design. Do not decorate generic workflows with cloud logos.
7. Show normal flow, material failure paths, trust boundaries, state ownership, observability, and human authority when relevant.
8. Provide a concise caption stating what the figure establishes, plus any assumptions or illustrative-data disclosure.
9. Verify desktop, mobile, keyboard, print, and ordinary page scrolling. Embedded figures must not capture wheel or touch gestures.
10. Run lint, typecheck, production build, rendered-publication validation, and visual validation before handoff.

## AWS architecture rules

- Use the current official AWS Architecture Icons package and full service names.
- Begin with the MRO problem and workload qualities; service selection follows.
- Separate airline/MRO systems, AWS accounts, Regions, VPCs, and external systems where those boundaries affect the design.
- Distinguish synchronous requests, asynchronous events, and failure/replay paths.
- Name important APIs, events, queues, and records rather than labeling every connector `data`.
- Include retries, idempotency, dead-letter behavior, encryption, audit, and observability where operationally material.
- Label conceptual reference architectures as conceptual; do not imply a deployable bill of materials.

## Prohibited patterns

- Hash- or date-randomized visual selection.
- The same node-and-arrow layout repeated across unrelated articles.
- Decorative KPI dashboards with invented production numbers.
- Huge fixed canvases, clipped labels, overlapping panels, illegible mobile scaling, or zoom surfaces that interfere with scrolling.
- Architecture diagrams that omit boundaries, protocols/events, state ownership, failure paths, or operational rationale.
- One-off SVGs embedded directly in article renderers.

The detailed review gate is in `docs/visual-review-checklist.md`; AWS conventions are in `docs/aws-architecture-visuals.md`.
