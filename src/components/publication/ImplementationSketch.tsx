import type { ArticleRecord } from '../../../app/lib/articles';

type Sketch={title:string;question:string;technology:string;available:string;code:string;note:string;source?:{href:string;label:string}};

// Use authored subject metadata, not the generic catalog description. The
// latter mentions failure modes for every article and previously caused an
// unrelated reliability snippet to appear in knowledge-graph publications.
const normalized=(article:ArticleRecord)=>`${article.title} ${article.categories.join(' ')} ${article.topicTags.join(' ')}`.toLowerCase();

function sketchFor(article:ArticleRecord):Sketch|null{
  if(article.issueDate<'2017-01-01')return null;
  const text=normalized(article);
  const implementationRelevant=/\bai\b|machine learning|\bml\b|model|predictive|computer vision|generative|agent|event|telemetry|stream|integration|cloud|\bapi\b|observability|data platform|data product|knowledge graph|digital twin|algorithm|forecast|correlation|normalization|orchestration|contract|ledger|retrieval|cybersecurity|exposure|statistical/.test(text);
  if(!implementationRelevant)return null;
  const bedrockEligible=article.issueDate>='2023-09-28'&&/generative|knowledge|retrieval|copilot|assistant|decision brief/.test(text);
  if(bedrockEligible)return{
    title:'Cited synthesis with an abstention path',question:'How can generated language remain subordinate to governed evidence?',technology:'Python pseudocode · Amazon Bedrock eligible',available:'Bedrock GA from September 2023',
    code:`def prepare_review_brief(question, aircraft_context):
    sources = retrieve_effective_documents(
        question=question,
        aircraft=aircraft_context.tail_number,
        configuration=aircraft_context.configuration,
        as_of=aircraft_context.decision_time,
    )

    if not sources or any(not s.effectivity_verified for s in sources):
        return Abstain(reason="effective evidence is incomplete")

    response = bedrock.generate(
        instruction="Synthesize only cited evidence; expose conflicts",
        evidence=[s.text for s in sources],
    )
    return ReviewBrief(
        synthesis=response.text,
        citations=[s.record_id for s in sources],
        unresolved=response.conflicts,
        authority="qualified human review required",
    )`,
    note:'Conceptual pseudocode. Model IDs, retrieval stores, IAM controls, evaluation criteria, and approved-data boundaries are implementation-specific.',source:{href:'https://aws.amazon.com/blogs/aws/amazon-bedrock-is-now-generally-available-build-and-scale-generative-ai-applications-with-foundation-models/',label:'AWS: Bedrock GA announcement'}};

  if(/knowledge graph/.test(text))return{
    title:'Effective-dated relationships with source provenance',question:'How can a graph distinguish a recorded relationship from an inferred one?',technology:'Python pseudocode · service-neutral graph contract',available:'Historically neutral method',
    code:`def add_relationship(graph, subject, predicate, object_, evidence):
    require(evidence.source_record_id)
    require(evidence.recorded_at and evidence.effective_from)

    edge = Relationship(
        subject_id=subject.governed_id,
        predicate=predicate,
        object_id=object_.governed_id,
        effective_from=evidence.effective_from,
        effective_to=evidence.effective_to,
        source_record_id=evidence.source_record_id,
        assertion="recorded" if evidence.authoritative else "inferred",
        confidence=None if evidence.authoritative else evidence.confidence,
    )
    graph.append(edge)          # corrections supersede; they do not erase
    return edge`,
    note:'Conceptual pseudocode. Identity resolution, effectivity, source authority, correction semantics, and access controls require operator-specific governance.'};

  if(article.issueDate>='2017-11-29'&&/machine learning|\bai\b|model|predictive|computer vision|classification|nlp/.test(text))return{
    title:'Versioned inference with an explicit review gate',question:'What must be preserved around a model prediction so engineering can challenge it?',technology:'Python pseudocode · Amazon SageMaker eligible',available:'SageMaker available throughout 2020–2026',
    code:`def score_for_review(evidence, model_release):
    require(evidence.source_ids and evidence.effectivity)
    require(evidence.event_time and evidence.quality_state)

    prediction = sagemaker_endpoint.invoke(
        model_version=model_release.version,
        features=derive_features(evidence),
    )

    result = InferenceRecord(
        score=prediction.score,
        model_version=model_release.version,
        source_ids=evidence.source_ids,
        feature_version=FEATURE_VERSION,
    )
    if prediction.out_of_scope or evidence.has_conflict:
        return Abstain(result, reason="outside validated boundary")
    return SendForQualifiedReview(result)`,
    note:'Conceptual pseudocode. A model may prioritize or classify evidence; it does not approve maintenance action or return an aircraft to service.',source:{href:'https://aws.amazon.com/about-aws/whats-new/2017/11/introducing-amazon-sagemaker/',label:'AWS: SageMaker launch announcement'}};

  if(article.issueDate>='2019-07-11'&&/event|telemetry|stream|integration|cloud|api|observability|message/.test(text))return{
    title:'Idempotent event intake and quarantine',question:'How should a consumer preserve evidence when delivery is duplicated or invalid?',technology:'Python pseudocode · Amazon EventBridge pattern',available:'EventBridge available throughout 2020–2026',
    code:`def handle_maintenance_event(envelope):
    assert envelope.event_id and envelope.schema_version

    if processed_events.contains(envelope.event_id):
        return AlreadyApplied(envelope.event_id)
    if not schema_registry.accepts(envelope):
        quarantine.put(envelope, reason="contract or identity failure")
        return NeedsRepair(envelope.event_id)

    evidence_store.append(envelope)       # immutable source envelope
    projection.apply(envelope)            # rebuildable operational view
    processed_events.record(envelope.event_id)
    publish("evidence.accepted", envelope.trace_context)`,
    note:'Conceptual pseudocode. Production designs must define ordering, retries, dead-letter handling, encryption, replay authorization, and reconciliation with the authoritative MRO record.',source:{href:'https://aws.amazon.com/about-aws/whats-new/2019/07/introducing-amazon-eventbridge/',label:'AWS: EventBridge launch announcement'}};

  if(/machine learning|\bai\b|model|predictive|computer vision|classification|nlp/.test(text))return{
    title:'Traceable model evaluation before operational use',question:'How can a model experiment remain reproducible without implying an unavailable managed service?',technology:'Python pseudocode · service-neutral ML',available:'Historically neutral method',
    code:`def evaluate_candidate_model(training_release, validation_cohort):
    require(training_release.source_lineage)
    require(validation_cohort.is_time_separated)
    require(validation_cohort.configuration_labels)

    model = train(training_release.features, training_release.labels)
    results = evaluate_by_operating_context(model, validation_cohort)
    if results.has_unsupported_cohort or results.safety_error_rate > limit:
        return RestrictUse(reason="validation boundary not satisfied")
    return ReviewPackage(
        model_version=model.version,
        dataset_versions=[training_release.id, validation_cohort.id],
        metrics=results.segmented_metrics,
        authority="engineering and qualified operational review",
    )`,
    note:'Conceptual, service-neutral pseudocode for pre-SageMaker publications. Thresholds, cohorts, labels, and operational release criteria require documented validation.'};

  if(/event|telemetry|stream|integration|cloud|api|observability|message/.test(text))return{
    title:'Durable event processing without service assumptions',question:'How can evidence remain replayable when a publication predates a referenced managed service?',technology:'Python pseudocode · service-neutral events',available:'Historically neutral method',
    code:`def accept_event(envelope):
    require(envelope.event_id and envelope.source_time)
    if deduplication_store.seen(envelope.event_id):
        return AlreadyApplied(envelope.event_id)
    if not contract_is_valid(envelope):
        quarantine.append(envelope, preserve_original=True)
        return NeedsReview(envelope.event_id)

    immutable_log.append(envelope)
    projection.apply(envelope)
    deduplication_store.record(envelope.event_id)
    return Accepted(envelope.event_id)`,
    note:'Conceptual, service-neutral pseudocode. Transport, storage, retry, security, audit, and replay controls depend on the historically available platform and the operator’s system boundaries.'};

  if(/reliability|defect|failure|health|removal|no.fault|trend|outcome/.test(text))return{
    title:'Exposure-normalized reliability comparison',question:'How can an analytical signal preserve population, exposure, and uncertainty?',technology:'Python pseudocode · service-neutral',available:'Historically neutral method',
    code:`def compare_reliability(events, exposure, cohort):
    applicable = events.where(
        fleet=cohort.fleet,
        configuration=cohort.configuration,
        date_range=cohort.observation_window,
    )
    numerator = count_confirmed_events(applicable)
    denominator = exposure.total_for(cohort)
    require(denominator > 0 and lineage_complete(applicable))

    rate = numerator / denominator
    interval = confidence_interval(numerator, denominator)
    return ReliabilityEvidence(
        rate=rate,
        uncertainty=interval,
        population=cohort,
        source_event_ids=applicable.ids,
        disposition="engineering review required",
    )`,
    note:'Illustrative method, not an approved reliability-program threshold. The exposure basis, cohort rules, statistical method, and action criteria require operator validation.'};

  if(/task|work package|record|document|configuration|component|part|material|inventory|handover/.test(text))return{
    title:'Controlled state transition with evidence checks',question:'Which conditions must be satisfied before a workflow state can advance?',technology:'Python pseudocode · service-neutral',available:'Historically neutral method',
    code:`def request_transition(item, target_state, actor):
    current = authoritative_store.load(item.id)
    rules = approved_workflow.for_revision(current.workflow_revision)

    require(actor.is_authorized_for(target_state))
    require(rules.permits(current.state, target_state))
    require(all(e.is_complete for e in current.required_evidence))
    require(current.effectivity.matches(item.aircraft_configuration))

    event = StateTransition(
        before=current.state,
        after=target_state,
        actor=actor.id,
        evidence_ids=current.required_evidence.ids,
    )
    return authoritative_store.commit(event, expected_version=current.version)`,
    note:'Conceptual pseudocode. Real transitions remain governed by approved procedures, access controls, signatures, inspection requirements, and the authoritative system of record.'};

  return null;
}

export function ImplementationSketch({article}:{article:ArticleRecord}){
  const sketch=sketchFor(article);if(!sketch)return null;
  return <section className="implementation-sketch" aria-labelledby={`implementation-${article.slug}`}>
    <header><div><span>IMPLEMENTATION SKETCH</span><h2 id={`implementation-${article.slug}`}>{sketch.title}</h2></div><p>{sketch.question}</p></header>
    <div className="implementation-sketch-meta"><span>{sketch.technology}</span><span>{sketch.available}</span><span>Illustrative—not production code</span></div>
    <pre tabIndex={0}><code>{sketch.code}</code></pre>
    <footer><strong>Engineering boundary</strong><p>{sketch.note}{sketch.source?<> <a href={sketch.source.href} target="_blank" rel="noreferrer">{sketch.source.label} ↗</a></>:null}</p></footer>
  </section>;
}
