/**
 * MineTrace API TypeScript Data Models matching FastAPI schemas.
 */

export interface SourceStatus {
  source_name: string;
  source_url: string;
  last_status: string;
  last_successful_retrieval?: string | null;
  last_attempt_timestamp?: string | null;
  total_records_ingested: number;
}

export interface SystemStatusResponse {
  status: string;
  database_location: string;
  sources: SourceStatus[];
  record_counts: Record<string, number>;
  last_retrievals: Record<string, string | null>;
}

export interface ClassificationSummaryResponse {
  total_analyses: number;
  classified_count: number;
  unclassified_count: number;
  classification_breakdown: Record<string, number>;
  flag_status_breakdown: Record<string, number>;
  disclaimer?: string;
}

export interface RankingEntry {
  rank: number;
  analysis_id: string;
  trade_record_id?: number | null;
  commodity_code: string;
  mineral_type?: string | null;
  reporter_country_code: string;
  partner_country_code: string;
  period: string;
  anomaly_score: number;
  score_completeness: string;
  classification?: string | null;
  flag_status?: string | null;
  sanctions_status: string;
  evaluated_rules: string[];
  created_at?: string;
}

export interface RuleResultResponse {
  rule_id: string;
  rule_name: string;
  rule_version: string;
  weight: number;
  outcome: string;
  threshold: string;
  formula: string;
  calculated_value?: number | null;
  input_values?: Record<string, unknown>;
  explanation: string;
  warnings?: string[];
}

export interface RiskAnalysisResponse {
  analysis_id: string;
  trade_record_id?: number | null;
  commodity_code: string;
  mineral_type?: string | null;
  reporter_country_code: string;
  partner_country_code: string;
  period: string;
  combined_anomaly_score: number;
  score_completeness: string;
  evaluated_rules: string[];
  insufficient_rules: string[];
  flagged_rules: string[];
  sanctions_status: string;
  sanctions_reference?: string | null;
  classification?: string | null;
  flag_status?: string | null;
  classification_explanation?: string | null;
  created_at: string;
  rule_results: RuleResultResponse[];
}

export interface RiskAnalysisListResponse {
  total: number;
  skip: number;
  limit: number;
  analyses: RiskAnalysisResponse[];
}

export interface PDFReportSummary {
  report_id: string;
  analysis_id: string;
  report_title?: string;
  title?: string;
  created_at: string;
  file_name?: string;
  file_path?: string;
  file_size_bytes?: number | null;
  sha256_hash?: string | null;
  content_hash?: string | null;
  download_url: string;
  evidence_snapshot_id?: string | null;
  template_version?: string;
  report_status?: string;
  has_evidence_snapshot?: boolean;
  has_validated_ai_explanation?: boolean;
  notes?: string | null;
  metadata_snapshot?: Record<string, unknown> | null;
}

export interface RankingSummaryResponse {
  total_analyses: number;
  eligible_complete_count: number;
  partial_excluded_count: number;
  unavailable_excluded_count: number;
  invalid_score_count: number;
  highest_score?: number | null;
  lowest_score?: number | null;
  average_score?: number | null;
  classification_breakdown: Record<string, number>;
  flag_status_breakdown: Record<string, number>;
  disclaimer: string;
}

export interface IncompleteRecordEntry {
  analysis_id: string;
  trade_record_id?: number | null;
  commodity_code: string;
  mineral_type?: string | null;
  reporter_country_code: string;
  partner_country_code: string;
  period: string;
  anomaly_score?: number | null;
  score_completeness: string;
  classification?: string | null;
  insufficient_rules: string[];
  evaluated_rules: string[];
  exclusion_reason: string;
  created_at: string;
}

export interface IncompleteRankingResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  records: IncompleteRecordEntry[];
  disclaimer: string;
}

export interface ValidationCheckResult {
  check_name: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown> | null;
}

export interface EvidenceValidationResponse {
  analysis_id: string;
  evidence_id?: string | null;
  validation_status: string;
  validation_timestamp: string;
  checks_performed: ValidationCheckResult[];
  validation_errors: string[];
  warnings: string[];
  unavailable_checks: string[];
  tolerance_used: number;
}

export interface RankingResponse {
  policy_version: string;
  tie_breaker_policy: string;
  scope: string;
  page: number;
  page_size: number;
  total_eligible: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  active_filters: Record<string, unknown>;
  rankings: RankingEntry[];
  disclaimer: string;
}

export interface MineralSummary {
  commodity_code: string;
  mineral_name: string;
  record_count: number;
  total_trade_value_usd: number;
  total_net_weight_kg: number;
  latest_period?: string | null;
  flow_types: string[];
}

export interface TradeRecord {
  id: number;
  commodity_code: string;
  mineral_type: string;
  reporter_country_code: string;
  reporter_country_name: string;
  partner_country_code: string;
  partner_country_name: string;
  period: string;
  flow_type: string;
  trade_value_usd: number;
  net_weight_kg: number;
  is_valid: boolean;
}

export interface TradeRecordListResponse {
  total: number;
  limit: number;
  skip: number;
  records: TradeRecord[];
}

export interface AuditEvent {
  event_id: string;
  timestamp: string;
  event_type: string;
  related_record_id?: string | null;
  operation_status: string;
  actor: string;
  metadata_summary?: Record<string, unknown> | null;
}

export interface AuditEventListResponse {
  total: number;
  page: number;
  page_size: number;
  events: AuditEvent[];
}

export interface RuleEvidenceItem {
  rule_id: string;
  rule_name: string;
  rule_version: string;
  weight: number;
  outcome: string;
  threshold: string;
  formula: string;
  calculated_value?: number | null;
  input_values?: Record<string, unknown>;
  explanation: string;
  warnings?: string[];
}

export interface SourceTraceability {
  trade_record_id?: number | null;
  source_dataset_name: string;
  source_record_id?: string | null;
  source_reference_url?: string | null;
  source_retrieval_timestamp?: string | null;
  source_payload_snapshot?: Record<string, unknown>;
}

export interface ScoreEvidence {
  combined_anomaly_score: number;
  score_completeness: string;
  evaluated_rules: string[];
  insufficient_rules: string[];
  flagged_rules: string[];
  sanctions_status: string;
  sanctions_reference?: string | null;
}

export interface ClassificationEvidence {
  classification?: string | null;
  flag_status?: string | null;
  explanation?: string | null;
  policy_version: string;
  thresholds_applied?: Record<string, unknown> | null;
}

export interface EvidenceSnapshotResponse {
  evidence_id: string;
  analysis_id: string;
  schema_version: string;
  created_at: string;
  analysis_timestamp: string;
  source_traceability: SourceTraceability;
  score: ScoreEvidence;
  classification: ClassificationEvidence;
  rules: RuleEvidenceItem[];
  data_quality_warnings: string[];
  validation_status: string;
  disclaimer: string;
}

export interface DashboardData {
  status: SystemStatusResponse | null;
  classificationSummary: ClassificationSummaryResponse | null;
  rankings: RankingResponse | null;
  minerals: MineralSummary[];
  auditEvents: AuditEvent[];
  lastUpdated: Date | null;
  isLive: boolean;
  loading: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Phase 7 AI Intelligence & Local RAG Types
// ---------------------------------------------------------------------------

export interface SupportingDocumentChunk {
  document_id: string;
  filename: string;
  chunk_id: string;
  content: string;
  relevance_score?: number | null;
}

export interface NumericalClaimValidation {
  claim: string;
  verified: boolean;
  expected_value?: unknown;
  notes: string;
}

export interface ExplainRequest {
  question: string;
  analysis_id?: string | null;
  top_k?: number;
  use_template_only?: boolean;
}

export interface ExplainResponse {
  question: string;
  analysis_id?: string | null;
  answer: string;
  generation_mode: 'LOCAL_LLM' | 'DETERMINISTIC_TEMPLATE' | string;
  model_name?: string | null;
  supporting_evidence_ids: string[];
  supporting_document_chunks: SupportingDocumentChunk[];
  numerical_claims: NumericalClaimValidation[];
  validation_status: 'VALID' | 'INVALID' | 'WARNINGS' | string;
  warnings: string[];
  disclaimer: string;
}

export interface AIStatusResponse {
  rag_service_available: boolean;
  chromadb_available: boolean;
  chromadb_dir: string;
  indexed_documents_count: number;
  indexed_chunks_count: number;
  embedding_model: string;
  embedding_model_available: boolean;
  ollama_reachable: boolean;
  ollama_base_url: string;
  ollama_model: string;
  ollama_model_available: boolean;
  offline_mode: boolean;
  warnings: string[];
  setup_instructions?: string | null;
}

// ---------------------------------------------------------------------------
// Phase 7 PDF Report Types
// ---------------------------------------------------------------------------

export interface GeneratePDFReportRequest {
  analysis_id: string;
  include_ai_explanation?: boolean;
  notes?: string;
}

export interface PDFReportListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  reports: PDFReportSummary[];
}

export interface ReportMetadataResponse {
  report_id: string;
  analysis_id: string;
  evidence_snapshot_id?: string | null;
  template_version: string;
  report_title: string;
  file_size_bytes?: number | null;
  content_hash?: string | null;
  report_status: string;
  has_evidence_snapshot: boolean;
  has_validated_ai_explanation: boolean;
  notes?: string | null;
  download_url: string;
  created_at: string;
  metadata_snapshot?: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Phase 8 System Readiness & Settings Types
// ---------------------------------------------------------------------------

export interface ComponentHealth {
  status: string;
  message?: string | null;
}

export interface ReadinessResponse {
  status: string;
  version: string;
  environment: string;
  timestamp: string;
  offline_mode: boolean;
  components: Record<string, ComponentHealth>;
  data_counts: Record<string, number>;
}
