export const historicalExpansions: Record<string, { context: string[]; validation: string[] }> = {
  '2026-03-ai-agent-assurance': {
    context: [
      'An AI agent changes the assurance problem because it can choose a sequence of tools, retain state, and alter external systems before a reviewer sees the final response. In maintenance, an apparently harmless planning step can retrieve inapplicable data, associate the wrong aircraft, draft an unsupported action, or write to a workflow whose downstream meaning exceeds the agent’s authority.',
      'The safe design begins with an action inventory. Each tool needs typed inputs and outputs, least-privilege credentials, permitted aircraft and records, idempotency behavior, timeout and retry rules, and a clear statement of whether it reads evidence, prepares a draft, or changes operational state. Maintenance release, approval, and return-to-service authority must remain unavailable to the agent.',
      'Evidence checkpoints should interrupt the plan before consequential steps. The agent must show the governing identities, applicable sources, unresolved conflicts, intended write, and accountable reviewer. A human gate is meaningful only when the reviewer can understand the proposed state change and reject it without losing the underlying case.'
    ],
    validation: [
      'Do not grade only the final answer. Inspect the route the agent took: tool selection, parameters, source eligibility, recovery from partial failure, repeated execution, stale state, misleading retrieved content, and attempts to exceed scope. The trace should let an assessor reproduce every observation and proposed action.',
      'A non-operational twin can exercise representative work orders, records, and event sequences without exposing live maintenance state. Scenarios should include ambiguous aircraft identity, unavailable tools, conflicting technical sources, and a user request that invites the agent to bypass approval. Success includes safe refusal and clean handoff, not only task completion.',
      'Production rollout should remain bounded by role, fleet, use case, and reversible action. Monitor tool errors, denied actions, human changes, abandoned plans, repeated retries, and evidence gaps. NIST AI RMF lifecycle controls and EASA’s human-centric aviation AI direction provide useful assurance framing, but the operator’s approved data, procedures, security controls, and qualified personnel remain authoritative.'
    ]
  },
  '2026-10-multimodal-maintenance-evidence': {
    context: [
      'A maintenance image is useful only when the reviewer can establish what it depicts. Aircraft identity, structure or component location, orientation, scale, capture device, lighting, surface preparation, environmental condition, and task context determine whether a visible feature can support a technical observation. Text and telemetry may add context, but they cannot repair an image that lacks essential provenance.',
      'The evidence object should preserve the original media, capture metadata, calibration or scale reference, operator annotations, relevant configuration, and links to the controlling task and record. Derived crops, enhancements, embeddings, detections, and generated descriptions should be stored as versioned interpretations rather than replacements for the source.',
      'Quality gates belong before classification. Blur, occlusion, inadequate coverage, saturation, compression, missing scale, or uncertain location should produce a retake or abstention state. A plausible label on insufficient evidence is more dangerous than an explicit request for better capture because visual fluency can create false confidence.'
    ],
    validation: [
      'Evaluation should use independently adjudicated cases and report results by capture condition, device, aircraft area, finding type, and severity or consequence where applicable. Measure missed findings, unnecessary escalation, localization error, quality-gate performance, reviewer correction, and the percentage of operational inputs outside the validated population.',
      'Prospective trials are essential. Curated historical images often omit the access limitations, variable lighting, contamination, camera motion, and incomplete coverage found in line and hangar work. The study should preserve disagreements and inconclusive cases rather than forcing consensus labels that overstate what the media can show.',
      'Multimodal assistance may organize evidence, compare prior captures, or prepare an inspection brief. It must not convert a visual inference into task completion, inspection acceptance, or return-to-service authority. Those actions remain governed by approved instructions, required measurements, organizational procedures, and qualified personnel.'
    ]
  }
};
