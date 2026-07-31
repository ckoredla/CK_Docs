# AWS architecture visual standard

## Source and scope

AWS service marks in the visual lab come from the official AWS Architecture Icons package dated April 30, 2026. The assets are used only to identify AWS services inside architecture diagrams. Source: <https://aws.amazon.com/architecture/icons/>.

The first reference pattern addresses a common MRO integration problem: converting a maintenance discrepancy into a controlled, traceable work order while an external MRO platform remains the system of record.

## Required diagram grammar

- State the operational problem before selecting services.
- Show the airline/MRO environment separately from the AWS Region.
- Label synchronous requests, asynchronous domain events, and failure/replay paths differently.
- Use official AWS icons and full service names; use application-specific labels for Lambda responsibilities.
- Make human maintenance authority an explicit boundary, not an implicit workflow step.
- Show state, evidence, audit, encryption, telemetry, retry, and dead-letter behavior when they affect the architecture.
- Describe the payload at important boundaries, such as `DiscrepancyRecorded` or an authorized work-order command.
- Do not imply that a conceptual reference architecture is a deployable bill of materials.

## Pattern assumptions

- The airline or MRO already has identity, technician, maintenance-control, and system-of-record capabilities.
- The intake API acknowledges quickly and does not wait for enrichment or MRO synchronization.
- Case state and idempotency records are separate from immutable evidence objects.
- A maintenance-control decision is required before a work-order command is released.
- The MRO connector can be unavailable or rate-limited, so commands are buffered and replayable.
- Service selection, Regions, recovery objectives, retention, throughput, and regulatory controls must be validated for each implementation.
