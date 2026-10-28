# Northbound Labs publication peer review

Review date: 2026-10-28  
Scope: 147 published articles, January 2017 through December 2026  
Review posture: IEEE-style technical reviewer, senior technology advocate, aviation maintenance and AI domain lens

## Overall verdict

The archive is suitable as a professional technical journal only with continuing editorial controls. It is not accurate to describe every article as meeting an IEEE paper standard. The collection has a clear operational thesis, consistently preserves qualified human authority, and now meets a strong structural and visual baseline. However, much of the historical archive uses broad institutional references rather than claim-level citations, and many articles present engineering guidance rather than a reproducible research method or evaluated dataset.

The correct disposition is **conditional acceptance as technical publishing**, not blanket scholarly acceptance.

## What now passes across the full archive

- Every article renders substantive text, metadata, references, related reading, and previous/next navigation.
- Every article uses two to four content-aware figures from the publication design system.
- Legacy generic visual families are prohibited for all 147 articles.
- Figures declare the technical question they answer and use at least two distinct information models per article.
- AWS architecture is restricted to cloud-platform topics; it is not used as decoration.
- Code examples are explicitly illustrative and selected against service-availability dates.
- Aviation maintenance authority remains with approved data, organizational procedure, and qualified personnel.
- Flagship SVG connector labels have collision-safe backgrounds and offset routing; mobile readers receive a textual relationship transcript rather than illegibly scaled labels.

## Findings that require editorial review

### 1. Claim-level evidence — high priority

Historical articles frequently cite FAA, NASA, and ICAO resource portals. Those are credible starting points but do not prove an individual architecture, human-factors, reliability, or AI claim. Each article needs a source matrix linking material claims to a specific regulation, advisory circular, report, standard, AWS service document, or peer-reviewed paper.

Acceptance gate: no quantitative, regulatory, service-capability, or safety-relevant claim without a directly supporting source. Synthetic examples must be labeled illustrative.

### 2. Method and reproducibility — high priority

The archive contains engineering essays and reference designs, not 147 empirical studies. Articles that discuss model performance, reliability change, or causal effectiveness must state the population, observation window, exposure basis, exclusions, uncertainty method, and validation limits. If no dataset is presented, the article must say that the figure is a conceptual design rather than measured evidence.

Acceptance gate: distinguish clearly among conceptual architecture, worked example, field observation, and empirical result.

### 3. Historical and product accuracy — high priority

AWS and AI examples must remain constrained to capabilities available at the article date. Current automated gates prevent Bedrock before September 2023, SageMaker before November 2017, and EventBridge before July 2019. Editorial review must still verify individual feature availability, Region support, API names, and whether a feature was preview or generally available.

Acceptance gate: official product-history source for time-sensitive service claims.

### 4. Visual validation — release blocking

No figure may contain overlapping labels, clipped content, text below a readable size, unexplained connectors, or a canvas that captures ordinary vertical scrolling. Desktop, mobile, keyboard, print, and reduced-motion views must be checked. A text transcript is required where a dense topology cannot remain legible on a narrow viewport.

Acceptance gate: the visual-review checklist passes at 390 px, 768 px, 1440 px, and print.

### 5. Editorial distinctiveness — medium priority

The historical collection uses a shared publication scaffold. That is acceptable for navigation and governance, but article arguments, evidence, failure modes, and conclusions must be independently authored. Repeated prose should be limited to explicit safety or editorial disclosures.

Acceptance gate: each article states a distinct question, bounded thesis, counterargument or failure mode, and specific practical conclusion.

## Remediation plan

1. **Visual integrity — implemented now.** Full-archive premium routing, collision-safe flagship labels, mobile transcripts, non-interactive scrolling, and rendered validation.
2. **Evidence review — three controlled batches.** Review 2024–2026, then 2021–2023, then 2017–2020. Build a claim/source matrix per article; replace portal references with specific documents.
3. **Method review.** Add method, assumptions, dataset status, uncertainty, and limitations where the article makes analytical claims. Do not invent measurements.
4. **Domain review.** Aviation SME verifies effectivity, approved-data boundaries, terminology, role authority, and return-to-service language. AI reviewer verifies evaluation, drift, abstention, and human-oversight claims.
5. **Release review.** Run `npm run check` and `npm run audit:publication`, visually inspect representative pages from every profile and year, and record exceptions before deployment.

## Automated audit

`npm run audit:publication` evaluates the rendered archive for substantive length, article structure, purposeful and distinct figures, explicit visual questions, reference breadth, limitation and authority language, navigation, and accessible flagship transcripts. Passing this audit is necessary but not sufficient for claim-level scholarly acceptance.
