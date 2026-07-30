export type ArchiveArticle = { slug: string; title: string; date: string; category: string; summary: string };

type Topic = [title: string, category: string];

const timeline: Record<number, Topic[]> = {
  2020: [
    ['Cloud Foundations Before Migration', 'AWS Architecture'],
    ['The Case for Infrastructure as Code', 'Cloud Engineering'],
    ['Containers Without Kubernetes Everywhere', 'Containers'],
    ['Serverless Beyond Small Functions', 'Serverless'],
    ['Designing Multi-Account AWS Environments', 'AWS Architecture'],
    ['Building Reliable CI/CD Pipelines', 'DevOps'],
    ['Event-Driven Architecture in Practice', 'Distributed Systems'],
    ['Data Lakes That Do Not Become Data Swamps', 'Data Platforms'],
    ['Observability as a Product Capability', 'Reliability'],
    ['The Well-Architected Review as an Engineering Habit', 'AWS Architecture'],
    ['Cloud Cost Is an Architecture Concern', 'FinOps'],
    ['Platform Engineering Before It Had the Name', 'Platform Engineering']
  ],
  2021: [
    ['Graviton and the Return of Architecture Awareness', 'Cloud Compute'],
    ['Kubernetes Autoscaling Without Guesswork', 'Containers'],
    ['Serverless Analytics Comes of Age', 'Data Platforms'],
    ['Streaming Systems Need Product Thinking', 'Streaming'],
    ['Digital Twins Move Toward Operations', 'IoT'],
    ['Modernizing Mainframes Without Rewriting the Universe', 'Modernization'],
    ['Zero Trust Is More Than Network Segmentation', 'Security'],
    ['API Platforms for Enterprise Scale', 'API Architecture'],
    ['Schema Evolution in Event-Driven Systems', 'Distributed Systems'],
    ['Resilience Testing Before Production Does It for You', 'Reliability'],
    ['Internal Developer Platforms and Golden Paths', 'Platform Engineering'],
    ['Cloud WAN and the Simplification of Global Connectivity', 'Networking']
  ],
  2022: [
    ['From Lift-and-Shift to Cloud-Native Modernization', 'Modernization'],
    ['Serverless Data Processing at Enterprise Scale', 'Data Platforms'],
    ['Supply Chain Security Enters the Build Pipeline', 'DevSecOps'],
    ['FinOps Becomes an Engineering Discipline', 'FinOps'],
    ['EventBridge, Kafka, and Choosing the Right Event Backbone', 'Distributed Systems'],
    ['Platform Teams as Product Teams', 'Platform Engineering'],
    ['Data Mesh Meets Enterprise Reality', 'Data Platforms'],
    ['MLOps Beyond Model Deployment', 'Machine Learning'],
    ['Confidential Computing and Sensitive Workloads', 'Security'],
    ['Sustainability Architecture Becomes Measurable', 'Cloud Architecture'],
    ['Application Modernization with Strangler Patterns', 'Modernization'],
    ['The Emerging Generative AI Inflection Point', 'Artificial Intelligence']
  ],
  2023: [
    ['Foundation Models Enter the Enterprise', 'Generative AI'],
    ['Retrieval-Augmented Generation Before the Hype Settles', 'Generative AI'],
    ['Amazon Bedrock and the Managed Model Layer', 'AWS AI'],
    ['Vector Databases Are an Index, Not a Strategy', 'Data Platforms'],
    ['Prompt Engineering as Interface Design', 'Generative AI'],
    ['AI Governance Moves Into Architecture', 'AI Governance'],
    ['Building Enterprise Copilots That Employees Use', 'Generative AI'],
    ['LLM Evaluation Is the Missing Delivery Pipeline', 'AI Engineering'],
    ['Agents: Useful Pattern or Distributed Confusion', 'Agentic AI'],
    ['Generative AI Security Threat Modeling', 'AI Security'],
    ['Small Models, Fine-Tuning, and Model Choice', 'AI Engineering'],
    ['From AI Demo to Production System', 'AI Engineering']
  ],
  2024: [
    ['Enterprise RAG Gets Serious About Permissions', 'Generative AI'],
    ['AI Observability Beyond Token Counts', 'AI Engineering'],
    ['Amazon Q and the Rise of Developer Assistants', 'Developer Productivity'],
    ['Guardrails for Generative AI Systems', 'AI Safety'],
    ['Multimodal AI Reaches Operational Workflows', 'Artificial Intelligence'],
    ['Knowledge Graphs Return for the AI Era', 'Data Platforms'],
    ['Agentic Workflows Need State Machines', 'Agentic AI'],
    ['AI Cost Engineering Becomes Necessary', 'FinOps'],
    ['Synthetic Data and Evaluation at Scale', 'AI Engineering'],
    ['Responsible AI Moves From Policy to Controls', 'AI Governance'],
    ['Platform Engineering for AI Teams', 'Platform Engineering'],
    ['Bedrock Flows and Managed AI Orchestration', 'AWS AI']
  ],
  2025: [
    ['AI Agents Move From Prototype to Workflow', 'Agentic AI'],
    ['Model Context Protocol and Tool Interoperability', 'Agentic AI'],
    ['Reasoning Models Change Application Design', 'AI Engineering'],
    ['AI Coding Agents and the Software Delivery Lifecycle', 'Developer Productivity'],
    ['The Return of the Forward Deployed Engineer', 'Engineering Careers'],
    ['Enterprise AI Needs Semantic Layers', 'Data Platforms'],
    ['Human-in-the-Loop Is a System, Not a Checkbox', 'AI Governance'],
    ['AI Gateway Patterns for Multi-Model Enterprises', 'AI Architecture'],
    ['Evaluating Agents on Outcomes, Not Conversations', 'Agentic AI'],
    ['AI-Native Product Management', 'Product Engineering'],
    ['Secure Tool Use for Enterprise Agents', 'AI Security'],
    ['From Cloud Center of Excellence to AI Enablement Platform', 'Platform Engineering']
  ],
  2026: [
    ['Forward Deployed Engineering Becomes a Core AI Function', 'Engineering Careers'],
    ['Agent Platforms Replace Isolated Chatbots', 'Agentic AI'],
    ['AI Deployment Engineering for Regulated Enterprises', 'AI Engineering'],
    ['The Semantic Layer as Enterprise AI Infrastructure', 'Data Platforms'],
    ['Production AI Requires Organizational Change', 'AI Leadership'],
    ['AI Reliability Engineering Emerges', 'Reliability'],
    ['What the FDE Boom Means for Engineering Leaders', 'Engineering Careers']
  ]
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const summaryFor = (title: string, category: string) =>
  `A practical field note on ${title.toLowerCase()}, viewed through ${category.toLowerCase()}, enterprise delivery, operating risk, and measurable outcomes.`;

export const archiveArticles: ArchiveArticle[] = Object.entries(timeline)
  .flatMap(([year, topics]) => topics.map(([title, category], index) => ({
    slug: slugify(title),
    title,
    category,
    date: `${year}-${String(index + 1).padStart(2, '0')}-15`,
    summary: summaryFor(title, category)
  })))
  .sort((a, b) => b.date.localeCompare(a.date));

export const findArchiveArticle = (slug: string) => archiveArticles.find((article) => article.slug === slug);
