# MineTrace — Critical Mineral Supply Chain Risk Intelligence

MineTrace is a local-first critical mineral supply chain integrity, provenance tracking, and sanctions verification platform.

- **Phase 1: Data Collection, Cleaning & Database**: Ingests, normalizes, deduplicates, and stores UN Comtrade mineral trade flows and official US Treasury OFAC sanctions records in SQLite with full offline-first resilience.
- **Phase 2: Risk Detection & Scoring Engine**: Implements a deterministic, explainable 5-rule risk engine, calculating weighted anomaly scores (0–100), tracking score completeness, and auditing rule evaluations.
- **Phase 3: Risk Classification Engine**: Classifies saved Phase 2 risk-analysis results into `GREEN`, `AMBER`, `RED`, or `INSUFFICIENT_DATA` with rigorous data sufficiency guardrails and distinct flag status tracking.
- **Phase 4: Risk Ranking Engine**: Ranks eligible risk analyses deterministically in descending score order with reproducible tie-breaking, strict data completeness isolation, multi-dimensional filtering, and point-in-time snapshot persistence.
- **Phase 5: Evidence Generation & Audit Trail**: Freezes immutable point-in-time evidence snapshots, performs multi-attribute mathematical verification, and maintains append-only operational audit logs for complete traceability.
- **Phase 6: Local RAG and Explainable AI**: Evidence-grounded retrieval-augmented generation and explainable AI. Queries retrieve authoritative structured facts directly from SQLite and semantic methodology passages from ChromaDB vector storage. Generates explanations via local Ollama or built-in deterministic fallback templates, verifies numerical claims, defends against prompt injection, and audits all AI queries.
- **Phase 7: Printable PDF Evidence Reports**: Generates professional, multi-page, court-ready printable PDF evidence dossiers from saved analyses and Phase 5 frozen snapshots. Features A4 formatting, running headers/footers with 'Page X of Y', complete rule breakdown tables, sanctions screening, audit histories, validated AI explanations, and strict methodology disclaimers.
- **Phase 8: Final Integration, End-to-End Testing & Offline Readiness**: Unifies all 7 phases into a cohesive, verified local-first backend. Provides comprehensive system readiness diagnostic endpoints (`GET /health/readiness`), 12-step end-to-end integration workflows with edge case test suites, zero remote cloud dependencies, and complete offline operability.

---

## Architecture Overview

- **Runtime & Language**: Python 3.11+ (CPython 3.12)
- **API Framework**: FastAPI with Pydantic v2 schemas
- **Database**: SQLite with SQLAlchemy 2.0 ORM & WAL mode
- **Ingestion (Phase 1)**:
  - **UN Comtrade API v1**: Configurable mineral commodity codes (Lithium, Cobalt, Nickel, Graphite, Rare Earths), handling pagination, rate limits, and missing value retention.
  - **OFAC Sanctions List**: Specially Designated Nationals (SDN) parser with local offline caching.
- **Risk Engine (Phase 2)**:
  - Deterministic evaluation of Rules R1–R5.
  - Weighted anomaly score (0–100) across R1–R4.
  - Separate sanctions screening status (R5).
  - Explicit score completeness tracking (`COMPLETE`, `PARTIAL`, `UNAVAILABLE`).
- **Classification Engine (Phase 3)**:
  - Prototype color tiering: `GREEN` (0–19), `AMBER` (20–49), `RED` (50–100).
  - Strict data sufficiency guardrails: `PARTIAL` or `UNAVAILABLE` completeness defaults to `INSUFFICIENT_DATA`.
  - Independent flag status (`FLAGGED` vs `NOT_FLAGGED`).
  - Full auditability preserving original numerical scores and explanations.
- **Testing**: Automated test suite with Pytest using isolated in-memory SQLite and offline fixtures (108 tests).

---

## Directory Structure

```text
minetrace/
├── app/
│   ├── main.py                     # FastAPI application entrypoint and lifespan
│   ├── core/
│   │   ├── config.py               # Pydantic BaseSettings environment configuration
│   │   └── logging.py              # Centralized logging setup
│   ├── database/
│   │   ├── connection.py           # SQLite connection, engine, pragma, and init_db
│   │   ├── models.py               # SQLAlchemy ORM models (12 tables)
│   │   └── repository.py           # Repository data access layer
│   ├── schemas/
│   │   ├── trade.py                # Pydantic schemas for trade records & minerals
│   │   ├── sanctions.py            # Pydantic schemas for OFAC records
│   │   ├── ingestion.py            # Schemas for ingestion requests/responses
│   │   ├── status.py               # Schemas for health & data status
│   │   ├── risk.py                 # Schemas for risk rules, analysis, & summaries
│   │   ├── classification.py       # Schemas for risk classification & summaries
│   │   ├── ranking.py              # Schemas for risk ranking, snapshots, & summaries
│   │   ├── evidence.py             # Schemas for evidence snapshots & validation reports
│   │   ├── audit.py                # Schemas for append-only audit events
│   │   └── ai.py                   # Schemas for local RAG, explainable AI, & document ingestion
│   ├── ingestion/
│   │   ├── comtrade_client.py      # UN Comtrade API HTTP client with fixture fallback
│   │   ├── ofac_client.py          # OFAC SDN CSV client with offline cache preservation
│   │   ├── validators.py           # Independent field validators & mineral mappings
│   │   ├── cleaning.py             # Record-level cleaning, hashing, & issue detection
│   │   └── service.py              # IngestionService coordinating audit & storage
│   ├── risk/
│   │   ├── rules.py                # Rule constants, weights, thresholds, and metadata
│   │   ├── engine.py               # Pure deterministic evaluation logic for R1-R5
│   │   └── service.py              # RiskEngineService orchestrating DB and audits
│   ├── classification/
│   │   ├── rules.py                # Threshold constants, disclaimer, & metadata
│   │   ├── engine.py               # Pure deterministic classification logic
│   │   └── service.py              # ClassificationService coordinating DB persistence
│   ├── ranking/
│   │   ├── rules.py                # Ranking policy version, tie-breaking policy, & disclaimer
│   │   └── service.py              # RankingService coordinating ranking, filters, & snapshots
│   ├── evidence/
│   │   ├── rules.py                # Evidence schema version, validation checks, & tolerances
│   │   └── service.py              # EvidenceService & EvidenceValidationService
│   ├── audit/
│   │   └── service.py              # AuditEventService managing append-only operational events
│   ├── rag/
│   │   ├── rules.py                # System prompts, fallbacks, disclaimers, & audit event types
│   │   ├── embedding_service.py    # Local dense embeddings (Ollama / deterministic hash fallback)
│   │   ├── chroma_service.py       # Persistent vector collection adapter (ChromaDB / JSON-NumPy)
│   │   ├── document_service.py     # Document parser (MD, TXT, PDF), chunker, & SHA-256 deduplicator
│   │   ├── evidence_builder.py     # Authoritative structured facts extractor from SQLite
│   │   ├── ollama_service.py       # Local Ollama client & deterministic explanation synthesizer
│   │   ├── claim_validator.py      # Grounding verifier for scores, classifications, & prompt injection
│   │   └── service.py              # RAGService orchestrating the 10-step evidence-grounded pipeline
│   ├── reports/
│   │   ├── rules.py                # Report metadata constants, template versions, & legal disclaimers
│   │   ├── data_service.py         # ReportDataService extracting frozen evidence bundles from SQLite
│   │   ├── pdf_generator.py        # PDFReportGenerator (ReportLab Platypus & ISO 32000-1 pure Python builder)
│   │   └── service.py              # PDFReportService managing report persistence, SHA-256, & security
│   └── api/
│       └── routes/
│           ├── health.py           # GET /health
│           ├── status.py           # GET /api/v1/data/status
│           ├── trade.py            # GET /api/v1/trade-records, GET /api/v1/minerals
│           ├── ingestion.py        # POST /api/v1/ingestion/trade, POST /api/v1/ingestion/sanctions
│           ├── risk.py             # POST /api/v1/risk/analyze, GET /api/v1/risk/results, etc.
│           ├── classification.py   # POST /api/v1/classification/classify, GET ...
│           ├── ranking.py          # GET /api/v1/ranking, snapshots, summary, etc.
│           ├── evidence.py         # GET /api/v1/evidence/{id}, GET /api/v1/evidence/{id}/validate
│           ├── audit.py            # GET /api/v1/audit/events, GET /api/v1/audit/events/{id}
│           ├── ai.py               # POST /api/v1/ai/explain, POST /api/v1/ai/documents/ingest, etc.
│           └── reports.py          # POST /api/v1/reports/pdf, GET /api/v1/reports, download, etc.
├── data/
│   ├── raw/                        # Preserved raw downloaded files and OFAC cache
│   ├── processed/                  # Processed datasets and local SQLite database
│   ├── documents/                  # Local methodology & reference documents (.md, .txt, .pdf)
│   ├── chroma/                     # Persistent local vector storage directory
│   └── reports/                    # Generated printable PDF evidence reports
├── tests/
│   ├── conftest.py                 # Pytest fixtures and isolated SQLite setup
│   ├── fixtures/
│   │   ├── comtrade_sample.json    # Labeled UN Comtrade test fixture
│   │   └── ofac_sample.csv         # Labeled OFAC SDN test fixture
│   ├── test_database.py            # Database and repository unit tests
│   ├── test_cleaning.py            # Validation and cleaning rule tests
│   ├── test_comtrade.py            # UN Comtrade client and service tests
│   ├── test_ofac.py                # OFAC client and cache fallback tests
│   ├── test_api.py                 # FastAPI endpoint integration tests
│   ├── test_risk_engine.py         # Unit tests for R1-R5 rules & score aggregation
│   ├── test_risk_api.py            # Risk API endpoint integration tests
│   ├── test_classification_engine.py # Unit tests for Phase 3 classification thresholds
│   ├── test_classification_api.py  # Classification API integration tests
│   ├── test_ranking_engine.py      # Unit tests for Phase 4 ranking logic & tie-breaking
│   ├── test_ranking_api.py         # Ranking API endpoint integration tests
│   ├── test_evidence_engine.py     # Unit tests for Phase 5 evidence generation & validation
│   ├── test_evidence_api.py        # Evidence and Audit API endpoint integration tests
│   ├── test_rag_engine.py          # Unit tests for Phase 6 RAG pipeline, claim validator, & vectors
│   ├── test_rag_api.py             # Local RAG & Explainable AI API integration tests
│   ├── test_report_engine.py       # Unit tests for Phase 7 PDF builder, data bundles, & multi-page
│   └── test_report_api.py          # PDF report generation, listing, metadata, and download tests
├── scripts/
│   ├── init_db.py                  # CLI command to initialize SQLite database
│   └── run_ingest.py               # CLI tool to run trade & sanctions ingestion
├── requirements.txt                # Python dependencies
├── .env.example                    # Example environment configuration
└── README.md                       # Documentation and usage guide
```

---

## Phase 3: Risk Classification Engine

### 1. Classification Thresholds

| Anomaly Score | Classification | Description |
|---|---|---|
| **0–19** | `GREEN` | Low anomaly divergence across evaluated rules. Requires complete data sufficiency. |
| **20–49** | `AMBER` | Moderate anomaly divergence (e.g. one primary risk flag). |
| **50–100** | `RED` | Elevated anomaly divergence across multiple risk flags. |

**Exact Boundary Implementation**:
- Score `19.0` => `GREEN`
- Score `20.0` => `AMBER`
- Score `49.0` => `AMBER`
- Score `50.0` => `RED`
- Score `100.0` => `RED`
- Invalid scores (< 0 or > 100) are rejected and return `INSUFFICIENT_DATA`.

> [!NOTE]
> **Prototype Disclaimer**: These are prototype thresholds designed for supply chain investigative triage and provenance monitoring. They have **not** been statistically validated as probabilities of fraud, illegality, or regulatory sanctions evasion.

### 2. Data Sufficiency Guardrails

Phase 2 score completeness statuses (`COMPLETE`, `PARTIAL`, `UNAVAILABLE`) strictly govern Phase 3 classification:
1. **`UNAVAILABLE` Completeness**: Returns `INSUFFICIENT_DATA`. Missing data cannot be interpreted as low risk.
2. **`PARTIAL` Completeness**: Returns `INSUFFICIENT_DATA` by default because one or more scoring rules could not be evaluated.
3. **`COMPLETE` Completeness**: Classifies according to the configured score boundaries (`GREEN`, `AMBER`, `RED`).
4. **Preservation of Numerical Scores**: The original numerical score (e.g., 30.0 or 50.0) is preserved in audit records even when the classification is `INSUFFICIENT_DATA`.
5. **No False Greens**: `GREEN` is **never** assigned simply because available evidence is insufficient.

### 3. Flag Status Separation

The rule-based anomaly status is tracked independently of the color tier:
- **`FLAGGED`**: One or more evaluated scoring rules returned `FLAG`.
- **`NOT_FLAGGED`**: Zero evaluated scoring rules returned `FLAG`.

---

## Classification API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/classification/thresholds` | Returns prototype thresholds, categories, flag statuses, and disclaimer. |
| `POST` | `/api/v1/classification/classify` | Evaluates and persists classifications for saved Phase 2 risk analyses. |
| `GET` | `/api/v1/classification/results` | Retrieves paginated classified analysis results with filters (`classification`, `flag_status`). |
| `GET` | `/api/v1/classification/results/{analysis_id}` | Retrieves detailed classification and explanation for a specific analysis run. |
| `GET` | `/api/v1/classification/summary` | Returns breakdown across GREEN, AMBER, RED, INSUFFICIENT_DATA, and flag statuses. |

### Example Request

```http
POST /api/v1/classification/classify HTTP/1.1
Content-Type: application/json

{
  "commodity_code": "283691",
  "only_unclassified": false,
  "limit": 50
}
```

### Example Summary Response

```json
{
  "total_analyses": 4,
  "classified_count": 4,
  "unclassified_count": 0,
  "classification_breakdown": {
    "GREEN": 0,
    "AMBER": 0,
    "RED": 0,
    "INSUFFICIENT_DATA": 4
  },
  "flag_status_breakdown": {
    "FLAGGED": 2,
    "NOT_FLAGGED": 2
  },
  "disclaimer": "These are prototype thresholds configured for investigative risk triage and supply-chain provenance monitoring. They have not been statistically validated as probabilities of fraud, sanctions evasion, or legal wrongdoing. Missing data is never interpreted as a low-risk result."
}
```

---

## Phase 4: Risk Ranking Engine

### 1. Ranking Logic & Deterministic Ordering

Eligible trade-analysis records are ranked in descending order based on their saved Phase 2 anomaly score (0–100):
- **1-based Ranks**: The highest-risk eligible transaction receives Rank 1.
- **Score & Classification Immutability**: Historical Phase 2 anomaly scores and Phase 3 classifications are used directly and are never recalculated or modified during ranking.

### 2. Tie-Breaking Policy (`v1.0`)

When two or more records have identical anomaly scores, ties are resolved deterministically using a three-tier hierarchy:
1. `combined_anomaly_score DESC`: Highest numerical score ranks first.
2. `created_at DESC`: The more recently evaluated analysis takes precedence.
3. `analysis_id ASC`: Deterministic lexicographical UUID ordering guarantees zero ambiguity across platforms and test runs.

### 3. Data Completeness & Eligibility Guardrails

To prevent data-quality blind spots from being hidden in primary triage views:
- **`COMPLETE` Records**: Eligible for primary ranking (`/api/v1/ranking`).
- **`PARTIAL` & `UNAVAILABLE` Records**: Strictly excluded from the primary ranking. They are accessible via the dedicated `/api/v1/ranking/incomplete` endpoint with explicit exclusion explanations (e.g., `"Excluded from primary ranking: Risk analysis completeness is PARTIAL because one or more required scoring rules had insufficient data."`).
- **Integrity Guarantee**: Incomplete records are never labeled as low-risk or assigned artificial zeroes.

### 4. Multi-Dimensional Scopes & Filtering

The ranking engine supports granular filtering without altering historical scores:
- **Commodity Code / Mineral Type**: e.g., `283691` or `Lithium`.
- **Jurisdictions**: `reporter_country_code` and `partner_country_code`.
- **Temporal Windows**: Exact `period` or interval ranges (`period_start`, `period_end`).
- **Risk Attributes**: `classification` (`GREEN`, `AMBER`, `RED`), `flag_status` (`FLAGGED`, `NOT_FLAGGED`), and numerical bounds (`min_score`, `max_score`).
- **Scope Indicator**: Responses explicitly state whether the ranking is `GLOBAL` (all eligible records) or `FILTERED` (scoped to matching subsets).

### 5. Point-in-Time Ranking Snapshots

Persistent audit snapshots capture point-in-time ranking states for longitudinal tracking, compliance audits, and regulatory inquiries:
- Stored across `ranking_snapshots` and `ranking_snapshot_items` tables.
- Preserves filter parameters, total eligible records, excluded counts, and explicit ranks.

---

## Ranking API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/ranking` | Retrieves ranked list of eligible risk analyses with ordering, tie-breaking, filtering, and pagination. |
| `GET` | `/api/v1/ranking/incomplete` | Retrieves records excluded from primary ranking due to PARTIAL/UNAVAILABLE completeness with explanations. |
| `GET` | `/api/v1/ranking/summary` | Returns aggregate counts, score distribution (min, max, avg), and completeness breakdowns. |
| `GET` | `/api/v1/ranking/{analysis_id}` | Looks up the exact 1-based rank position and eligibility status for a specific analysis record. |
| `POST` | `/api/v1/ranking/snapshots` | Creates a persistent point-in-time ranking snapshot with applied filters and metadata. |
| `GET` | `/api/v1/ranking/snapshots` | Lists all persisted point-in-time ranking snapshots. |
| `GET` | `/api/v1/ranking/snapshots/{snapshot_id}` | Retrieves a specific ranking snapshot and all its ranked items. |

---

## Phase 5: Evidence Generation & Audit Trail

### 1. Objective & Architecture

Phase 5 establishes complete retrospective traceability and mathematical verification for all risk intelligence outputs. It freezes the exact inputs, formulas, thresholds, outputs, classifications, ranking context, and source references behind every risk result into an immutable evidence snapshot.

- **Immutability Guarantee**: Once an `EvidenceSnapshot` is created, modifying or deleting the underlying `NormalizedTradeRecord` does not alter the historical evidence. The frozen snapshot preserves the historical trade values (`flow_type`, `trade_value_usd`, `net_weight_kg`, etc.) and exact rule evaluation parameters.
- **Zero Recalculation on Retrieval**: `GET /api/v1/evidence/{analysis_id}` retrieves the saved point-in-time snapshot directly without recalculating risk rules or changing rankings.

### 2. Evidence Schema (`v1.0`)

The standard evidence JSON structure (`EVIDENCE_SCHEMA_VERSION = "1.0"`) is designed for seamless ingestion by Phase 6 (Local RAG) and Phase 7 (Deterministic PDF Reports):

```json
{
  "evidence_id": "0d20ef74-0fca-443b-8fc3-b2ae8a4b6438",
  "analysis_id": "ANALYSIS-001",
  "schema_version": "1.0",
  "created_at": "2026-10-27T14:40:00Z",
  "analysis_timestamp": "2026-10-27T14:39:50Z",
  "source_traceability": {
    "trade_record_id": 1,
    "source_dataset_name": "UN Comtrade (Normalized)",
    "source_record_id": "REC-1",
    "source_reference_url": null,
    "source_retrieval_timestamp": "2026-10-27T14:30:00Z",
    "source_payload_snapshot": {
      "trade_value_usd": 1000000.0,
      "net_weight_kg": 50000.0,
      "commodity_code": "283691",
      "reporter_country_code": "CHL",
      "partner_country_code": "USA"
    }
  },
  "score": {
    "combined_anomaly_score": 50.0,
    "score_completeness": "COMPLETE",
    "evaluated_rules": ["R1", "R2", "R3", "R4", "R5"],
    "insufficient_rules": [],
    "flagged_rules": ["R1", "R2"],
    "sanctions_status": "NO_IDENTIFIED_MATCH"
  },
  "classification": {
    "classification": "RED",
    "flag_status": "FLAGGED",
    "explanation": "Substantial anomaly divergence across multiple risk flags.",
    "policy_version": "1.0",
    "thresholds_applied": {
      "GREEN": { "min_score": 0.0, "max_score": 19.0 },
      "AMBER": { "min_score": 20.0, "max_score": 49.0 },
      "RED": { "min_score": 50.0, "max_score": 100.0 }
    }
  },
  "ranking": {
    "snapshot_id": "snapshot-uuid",
    "rank": 1,
    "total_eligible": 10,
    "is_eligible": true,
    "ranking_policy_version": "1.0"
  },
  "rules": [
    {
      "rule_id": "R1",
      "rule_name": "Mirror Trade Gap",
      "rule_version": "1.0",
      "weight": 30,
      "outcome": "FLAG",
      "threshold": "> 30.0%",
      "formula": "abs(export_value - import_value) / max(export_value, import_value) * 100",
      "calculated_value": 40.0,
      "input_values": { "export_value": 100000.0, "import_value": 60000.0 },
      "explanation": "Export-import mirror gap 40.0% exceeds 30% threshold.",
      "warnings": []
    }
  ],
  "validation_status": "VALID",
  "disclaimer": "Evidence snapshots capture the frozen historical input parameters, rule calculations, and classification thresholds at the time of assessment."
}
```

### 3. Dedicated Evidence Validation Service

The validation service (`GET /api/v1/evidence/{analysis_id}/validate`) runs a 9-check audit pass:
1. `analysis_exists`: Ensures the referenced risk analysis exists in the database.
2. `rule_ids_and_versions_valid`: Confirms all rule IDs are recognized (R1–R5) and versions match `"1.0"`.
3. `thresholds_match_policy`: Confirms stored rule thresholds match catalog policy thresholds.
4. `rule_calculations_consistency`: Re-executes the mathematical formulas against stored `input_values` using a floating-point tolerance of $10^{-4}$.
5. `combined_score_consistency`: Verifies that `combined_anomaly_score` strictly equals the sum of weights for flagged scoring rules (R1=30, R2=20, R3=30, R4=20).
6. `completeness_status_consistency`: Confirms score completeness (`COMPLETE`, `PARTIAL`, `UNAVAILABLE`) matches the count of evaluated scoring rules.
7. `classification_reference_consistency`: Verifies that classifications conform to score thresholds and that incomplete data strictly maps to `INSUFFICIENT_DATA`.
8. `ranking_reference_consistency`: Validates links to persistent ranking snapshots when present.
9. `source_integrity`: Confirms source record links and hashes without data fabrication.

> [!IMPORTANT]
> **Validation Integrity Policy**: If an evidence record fails validation (e.g. tampered score or calculation mismatch), the original evidence is **never silently altered or deleted**. It is preserved verbatim for investigative review, marked with `validation_status = "INVALID"`, and logged as an `EVIDENCE_VALIDATION_FAILED` audit event.

### 4. Operational Audit Trail

MineTrace maintains an append-only audit event log (`audit_events`) capturing 10 operational event types:
- `TRADE_INGESTION_COMPLETED` & `TRADE_INGESTION_FAILED`
- `SANCTIONS_INGESTION_COMPLETED` & `SANCTIONS_INGESTION_FAILED`
- `RISK_ANALYSIS_CREATED`
- `CLASSIFICATION_CREATED`
- `RANKING_SNAPSHOT_CREATED`
- `EVIDENCE_SNAPSHOT_GENERATED`
- `EVIDENCE_VALIDATION_PASSED` & `EVIDENCE_VALIDATION_FAILED`

> [!NOTE]
> **Audit Log Security Model & Limitations**:
> Audit events are recorded as append-only application-level database entries. They provide operational traceability and process accountability within the local application, but do not constitute cryptographically signed, immutable blockchain or WORM storage. Secrets, credentials, and raw stack traces are stripped before logging.

### 5. Enabling Downstream Phases

Phase 5 evidence directly supports subsequent roadmap phases:
- **Phase 6 (Local RAG)**: Provides structured, cited source records, formulas, and verified explanations to ground local LLM explanations without hallucinations.
- **Phase 7 (Deterministic PDF Reports)**: Supplies the immutable evidence blocks and validation badges required to render court-ready, audit-compliant compliance dossiers.

---

## Evidence & Audit API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/evidence/{analysis_id}` | Retrieves the complete frozen evidence snapshot for an analysis. |
| `GET` | `/api/v1/evidence/{analysis_id}/validate` | Runs the 9-point validation engine and returns check-by-check verification results. |
| `GET` | `/api/v1/audit/events` | Retrieves paginated append-only audit events with filters (`event_type`, `related_record_id`, `operation_status`, dates). |
| `GET` | `/api/v1/audit/events/{event_id}` | Retrieves details of a specific audit event by its UUID. |

---

## Phase 6: Local RAG and Explainable AI

MineTrace Phase 6 implements an evidence-grounded, privacy-preserving Local Retrieval-Augmented Generation (RAG) and Explainable AI engine.

### 1. Dual Retrieval Architecture
- **Authoritative Structured Evidence (SQLite)**: When explaining a specific risk analysis (`analysis_id`), exact values (anomaly score, rule evaluations, input values, formulas, calculated percentages, thresholds, and classifications) are retrieved directly from SQLite `EvidenceSnapshot` and `RiskAnalysis` models. Vector similarity is **never** used for exact numbers.
- **Semantic Reference Retrieval (ChromaDB)**: Local reference documents (risk methodology, data provenance, and classification policy in `data/documents/`) are embedded into dense vectors and indexed in `data/chroma/`. Queries retrieve relevant methodology excerpts via cosine similarity.

### 2. Local LLM Inference & Deterministic Fallback
- **Local Ollama Integration**: Connects to `http://localhost:11434` with configurable models (e.g., `llama3.2:latest`, `nomic-embed-text:latest`).
- **Deterministic Synthesizer Fallback**: If Ollama or the local model is offline/unreachable, MineTrace automatically activates its built-in deterministic fallback engine, assembling an evidence-grounded briefing from structured facts and retrieved methodology chunks without failing.

### 3. Claim Validation & Guardrails
- **Numerical & Fact Verification**: Verifies reported anomaly scores, classifications, evaluated rules, and thresholds against the authoritative SQLite record. Flags any discrepancies or unsupported numbers.
- **Prompt Injection Defense**: Scans prompts for adversarial injection patterns (`ignore previous instructions`, `system prompt override`, `you are now in DAN mode`) and neutralizes them safely.
- **Legal & Regulatory Disclaimers**: Every explanation automatically attaches formal disclaimers stating that risk classifications reflect deterministic anomaly indicators rather than legal findings of wrongdoing.

### 4. Phase 6 AI API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/ai/explain` | Generates an evidence-grounded explanation for a natural-language question or specific analysis. |
| `POST` | `/api/v1/ai/documents/ingest` | Scans `data/documents/` for Markdown, TXT, and PDF files, chunks them, and indexes them into ChromaDB. |
| `GET` | `/api/v1/ai/documents` | Lists indexed reference documents with chunk counts and SHA-256 hashes. |
| `DELETE` | `/api/v1/ai/documents/{document_id}` | Removes an indexed document and its chunks from the vector store safely. |
| `GET` | `/api/v1/ai/status` | Returns operational health and availability across ChromaDB, local embeddings, and Ollama. |

---

## Phase 7: Printable PDF Evidence Reports

MineTrace Phase 7 implements automated, professional, printable PDF evidence report generation from saved risk analyses and frozen Phase 5 evidence snapshots.

### 1. Report Content & Structure
Each generated report is structured into 7 core analytical sections:
1. **Cover & Metadata**: Report ID, Analysis ID, Report generation timestamp, Analysis timestamp, Template version (`1.0`), Analyst notes.
2. **Executive Summary**: Mineral/commodity identifier, Reporter/Partner countries, Period, Saved anomaly score, Score completeness (`COMPLETE`, `PARTIAL`, `UNAVAILABLE`), Classification (`GREEN`, `AMBER`, `RED`, `INSUFFICIENT_DATA`), Flag status, Sanctions screening result, Quality warnings. Prominently explains data insufficiency where baselines were missing.
3. **Risk Rule Evaluation Details**: Full table and expanded breakdowns for evaluated and insufficient rules (R1 Mirror Trade Gap, R2 Volume Surge, R3 Jurisdiction Transit Risk, R4 Unit Price Dispersion, R5 OFAC Sanctions). Shows exact input values, formulas, thresholds, calculated results, weights, and explanations without recalculating historical values.
4. **Classification & Guardrails**: Applied score thresholds, policy version, and classification explanation.
5. **Sanctions Screening**: OFAC SDN screening status (`REVIEW_MATCH`, `NO_IDENTIFIED_MATCH`, `UNKNOWN`), local registry reference, and explicit screening limitations.
6. **Source Evidence & Audit Trail**: Original source dataset name, record ID, endpoint URL, retrieval timestamp, evidence snapshot ID, validation status, and related audit events.
7. **Validated AI Explanation**: Embeds Phase 6 evidence-grounded AI explanations only when claims have passed automated verification against authoritative SQLite records.
8. **Methodology, Limitations & Legal Notice**: Prominent disclaimers clarifying that anomaly scores indicate statistical deviations rather than legal proof of wrongdoing.

### 2. PDF Design & Multi-Page Layout
- **Page Format**: Standard A4 (595.28 x 841.89 points).
- **Typography & Accessibility**: Clean Helvetica typography, high contrast, shaded section headers, colored callout alert cards with left accent bars, and full readability in grayscale/monochrome printing.
- **Running Headers & Footers**: Header displays project name, report title, and report ID. Footer displays generation timestamp and two-pass page numbers (`Page X of Y`).
- **Engine Architecture**: Dual-mode rendering supporting ReportLab Platypus when installed and a built-in ISO 32000-1 pure-Python PDF builder for 100% offline testability and zero external binary dependencies.

### 3. Report Storage, Safety & Traceability
- **Storage Location**: Stored exclusively in the dedicated local directory `data/reports/`.
- **Integrity**: Every report computes an SHA-256 content hash upon generation and indexes metadata in the `generated_reports` database table.
- **Path Traversal Security**: Download endpoints strictly validate report IDs and verify that resolved file paths are contained within the configured report directory.
- **Audit Integration**: All report creations and downloads are logged to the Phase 5 append-only audit trail (`REPORT_GENERATED`, `REPORT_DOWNLOADED`).

### 4. Phase 7 Report API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/reports/pdf` | Generates a printable PDF evidence report for an analysis and returns its summary. |
| `GET` | `/api/v1/reports` | Returns a paginated list of generated report metadata records (filterable by `analysis_id`). |
| `GET` | `/api/v1/reports/{report_id}` | Retrieves detailed metadata, file size, content hash, and download URL for a report. |
| `GET` | `/api/v1/reports/{report_id}/download` | Safely downloads the generated PDF file stream with `application/pdf` and `Content-Disposition` attachment headers. |

---

## Phase 8: Final Integration, End-to-End Testing & Offline Readiness

Phase 8 unifies Phases 1 through 7 into a single, cohesive, offline-ready backend platform and validates complete lifecycle integrity.

### 1. System Readiness Diagnostic Endpoint

MineTrace exposes a comprehensive system readiness inspection endpoint:
- `GET /health/readiness` (and `GET /api/v1/health/readiness`)

The readiness endpoint performs non-destructive health checks across **10 subsystems**:
1. **Application Core**: Uptime, software version (`0.8.0`), and environment state.
2. **Database Connectivity**: Active SQLite connection, schema integrity, and database file access.
3. **Data Availability**: Counts of normalized trade records and OFAC sanctions records.
4. **Risk Scoring Engine**: R1–R5 rules loaded, weighted catalog consistency, and mathematical model readiness.
5. **Classification Engine**: Thresholds loaded (`GREEN`, `AMBER`, `RED`), and guardrail policies operational.
6. **Ranking Engine**: Active ranking policy, deterministic tie-breaking, and snapshot capability.
7. **Evidence & Audit System**: Evidence snapshots frozen count, schema version, and append-only audit trail size.
8. **Vector Store**: Local ChromaDB persistence directory accessibility and document chunk index count.
9. **Ollama / AI Inference**: Local LLM connectivity check on loopback interface (`http://127.0.0.1:11434`), graceful fallback detection to deterministic template generation.
10. **PDF Reporting**: Local reports storage directory readiness, ReportLab or ISO 32000-1 pure-Python rendering engine status.

**Status Code Convention**:
- Returns `HTTP 200 OK` when all critical subsystems (application, database, risk, classification, ranking, evidence, reporting) are `HEALTHY`.
- Returns `HTTP 503 Service Unavailable` with `status: "DEGRADED"` or `"UNHEALTHY"` if any core dependency fails.

### 2. End-to-End 12-Step Lifecycle Verification

The integration test suite (`tests/test_end_to_end.py`) executes and asserts the complete lifecycle:
1. **Ingest Trade Records**: Ingest raw UN Comtrade JSON flows and OFAC SDN sanctions CSV.
2. **Normalized Storage**: Verify clean schema persistence, record hashes, and data quality issue logging.
3. **Deterministic Risk Analysis**: Run pure 5-rule engine (R1 Mirror Gap, R2 Volume Surge, R3 Jurisdiction Transit, R4 Unit Price Dispersion, R5 Sanctions Review).
4. **Rule Outcomes & Weights**: Confirm rule weights sum to 100%, and anomaly score lies within [0.0, 100.0].
5. **Risk Classification**: Map anomaly score to `GREEN`, `AMBER`, or `RED`, enforcing strict `INSUFFICIENT_DATA` guardrails for partial scores.
6. **Risk Ranking**: Retrieve record in primary ranking or incomplete records view with deterministic tie-breaking.
7. **Freeze Evidence Snapshot**: Create immutable point-in-time snapshot with source payload and rule evaluations.
8. **Validate Evidence**: Run 9-point mathematical and policy verification checks (`VALID` status).
9. **Local RAG AI Explanation**: Query local RAG service for evidence-grounded explanation with numerical claim verification.
10. **Generate PDF Evidence Report**: Compile multi-page PDF dossier with ReportLab / pure-Python ISO 32000-1 fallback.
11. **Download & Verify PDF**: Confirm valid `%PDF-1.4` binary stream, `%%EOF`, SHA-256 hash, and disclaimer sections.
12. **Historical Immutability**: Verify that subsequent operations leave historical analysis scores, classifications, and evidence snapshots untouched.

### 3. Edge Cases & Safety Defenses Verified

- **Zero / Missing Historical Baseline (R2 Volume Surge)**: Returns `NOT_EVALUATED`, marks completeness `PARTIAL`, and forces classification to `INSUFFICIENT_DATA` (never falsely `GREEN`).
- **Duplicate Ingestion Prevention**: Re-ingesting identical trade flows deduplicates on `record_hash` without record proliferation.
- **Missing Evidence Snapshot Report Warning**: PDF generator gracefully handles orphaned risk records by inserting explicit data sufficiency warnings.
- **Path Traversal Security Defense**: Report download rejects directory traversal sequences (`..`, `\`, `/`), preventing unauthorized filesystem access.

### 4. Offline Readiness & Self-Containment

MineTrace is engineered to operate completely offline:
- **Zero Cloud LLM Dependencies**: RAG explanations run on a local Ollama instance or fallback to an internal, deterministic factual template without external network requests.
- **Local Persistent Vector Storage**: Uses local directory storage (`data/chroma/`) without requiring remote vector cloud services.
- **Local Sanctions Caching**: Preserves local OFAC cache and fixtures (`data/cache/`, `tests/fixtures/`) when external connections are unavailable.
- **Local PDF Compilation**: Pure-Python ISO 32000-1 fallback guarantees PDF generation without external binaries or web services.
- **Zero Remote Telemetry**: No third-party trackers, analytics, or unverified egress network calls exist in the application.

---

## Setup & Running (Windows)

### 1. Setup Virtual Environment
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Initialize Database & Ingest Reference Documents
```powershell
python scripts/init_db.py
python scripts/run_ingest.py --source all --trade-fixture tests/fixtures/comtrade_sample.json --sanctions-fixture tests/fixtures/ofac_sample.csv
curl -X POST http://127.0.0.1:8000/api/v1/ai/documents/ingest
```

### 3. Check System Readiness
```powershell
curl http://127.0.0.1:8000/health/readiness
```

### 4. Generate & Download a PDF Report
```powershell
# Generate PDF for an analysis
curl -X POST http://127.0.0.1:8000/api/v1/reports/pdf -H "Content-Type: application/json" -d '{"analysis_id": "ANALYSIS_ID", "include_ai_explanation": false}'

# Download the generated PDF
curl -O http://127.0.0.1:8000/api/v1/reports/{REPORT_ID}/download
```

### 5. Start FastAPI Server
```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive documentation: `http://127.0.0.1:8000/docs`

---

## Running Automated Tests

Run the complete test suite (**110 tests** covering Phase 1 through Phase 8):

```powershell
pytest tests/test_cleaning.py tests/test_comtrade.py tests/test_ofac.py tests/test_database.py tests/test_risk_engine.py tests/test_classification_engine.py tests/test_ranking_engine.py tests/test_evidence_engine.py tests/test_rag_engine.py tests/test_report_engine.py tests/test_report_api.py tests/test_end_to_end.py -v
```
All tests run with isolated in-memory SQLite instances and offline fixtures without external network dependencies.
