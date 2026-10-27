"""SQLAlchemy ORM models for MineTrace."""
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from app.database.connection import Base


def utc_now() -> datetime:
    """Returns current UTC datetime."""
    return datetime.now(timezone.utc)


class DataSourceMetadata(Base):
    """Tracks metadata and freshness for external data sources."""
    __tablename__ = "data_source_metadata"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_name = Column(String(64), unique=True, nullable=False, index=True)
    source_url = Column(String(512), nullable=False)
    description = Column(String(255), nullable=True)
    last_successful_retrieval = Column(DateTime, nullable=True)
    last_attempt_timestamp = Column(DateTime, nullable=True)
    last_status = Column(String(32), default="NEVER_RUN", nullable=False)
    total_records_ingested = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)


class IngestionRun(Base):
    """Audit log of every ingestion run."""
    __tablename__ = "ingestion_runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_name = Column(String(64), nullable=False, index=True)
    run_type = Column(String(32), default="MANUAL", nullable=False)  # MANUAL, API, FIXTURE
    status = Column(String(32), default="RUNNING", nullable=False)  # RUNNING, COMPLETED, FAILED, PARTIAL
    started_at = Column(DateTime, default=utc_now, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    raw_records_count = Column(Integer, default=0, nullable=False)
    clean_records_count = Column(Integer, default=0, nullable=False)
    error_count = Column(Integer, default=0, nullable=False)
    warning_count = Column(Integer, default=0, nullable=False)
    parameters = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    raw_trade_records = relationship("RawTradeRecord", back_populates="ingestion_run", cascade="all, delete-orphan")
    quality_issues = relationship("DataQualityIssue", back_populates="ingestion_run", cascade="all, delete-orphan")


class RawTradeRecord(Base):
    """Raw, unaltered source records from UN Comtrade."""
    __tablename__ = "raw_trade_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ingestion_run_id = Column(Integer, ForeignKey("ingestion_runs.id"), nullable=True, index=True)
    source_record_id = Column(String(128), nullable=True, index=True)
    commodity_code = Column(String(32), nullable=True, index=True)
    period = Column(String(32), nullable=True, index=True)
    reporter_code = Column(String(32), nullable=True)
    partner_code = Column(String(32), nullable=True)
    raw_payload = Column(Text, nullable=False)  # Full JSON string of original source payload
    retrieval_timestamp = Column(DateTime, default=utc_now, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    ingestion_run = relationship("IngestionRun", back_populates="raw_trade_records")
    normalized_record = relationship("NormalizedTradeRecord", back_populates="raw_record", uselist=False)


class NormalizedTradeRecord(Base):
    """Cleaned, validated, and normalized trade records."""
    __tablename__ = "normalized_trade_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    raw_record_id = Column(Integer, ForeignKey("raw_trade_records.id"), nullable=True, unique=True)
    ingestion_run_id = Column(Integer, ForeignKey("ingestion_runs.id"), nullable=True, index=True)
    
    # Preserved source identifier
    source_record_id = Column(String(128), nullable=True, index=True)
    
    # Deduplication hash: SHA256 of canonical business keys
    record_hash = Column(String(64), unique=True, nullable=False, index=True)
    
    # Trade specifics
    commodity_code = Column(String(32), nullable=False, index=True)
    commodity_description = Column(String(255), nullable=True)
    mineral_type = Column(String(64), nullable=False, default="Unknown Mineral", index=True)
    
    # Flow: strictly 'IMPORT' or 'EXPORT'
    flow_type = Column(String(16), nullable=False, index=True)
    
    # Countries
    reporter_country_code = Column(String(16), nullable=False, index=True)
    reporter_country_name = Column(String(128), nullable=False, index=True)
    partner_country_code = Column(String(16), nullable=False, index=True)
    partner_country_name = Column(String(128), nullable=False, index=True)
    
    # Dates
    period = Column(String(32), nullable=False, index=True)  # e.g., '2023' or '2023-01'
    period_year = Column(Integer, nullable=False, index=True)
    period_month = Column(Integer, nullable=True)
    
    # Quantities & values: None if missing, NEVER default to 0
    trade_value_usd = Column(Float, nullable=True)
    currency = Column(String(8), default="USD", nullable=False)
    net_weight_kg = Column(Float, nullable=True)
    quantity = Column(Float, nullable=True)
    quantity_unit = Column(String(32), nullable=True)
    
    # Validation flags
    is_valid = Column(Boolean, default=True, nullable=False, index=True)
    has_warnings = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    retrieval_timestamp = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    raw_record = relationship("RawTradeRecord", back_populates="normalized_record")

    __table_args__ = (
        Index("idx_norm_trade_search", "commodity_code", "period_year", "flow_type"),
        Index("idx_norm_trade_countries", "reporter_country_code", "partner_country_code"),
    )


class OfacSanctionRecord(Base):
    """OFAC Sanctions List record (SDN / Consolidated)."""
    __tablename__ = "ofac_sanctions_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ingestion_run_id = Column(Integer, ForeignKey("ingestion_runs.id"), nullable=True, index=True)
    
    # OFAC unique record ID (e.g. Ent_num)
    source_record_id = Column(String(64), nullable=False, index=True)
    source_name = Column(String(64), default="OFAC_SDN", nullable=False)
    
    # Deduplication hash
    record_hash = Column(String(64), unique=True, nullable=False, index=True)
    
    entity_type = Column(String(32), nullable=True, index=True)  # individual, entity, vessel, aircraft
    primary_name = Column(String(255), nullable=False, index=True)
    aliases = Column(Text, nullable=True)
    programs = Column(String(255), nullable=True, index=True)
    country = Column(String(128), nullable=True, index=True)
    id_numbers = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)
    
    retrieval_timestamp = Column(DateTime, default=utc_now, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    __table_args__ = (
        Index("idx_ofac_name_country", "primary_name", "country"),
    )


class DataQualityIssue(Base):
    """Audit log of validation errors, missing fields, or quality warnings."""
    __tablename__ = "data_quality_issues"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ingestion_run_id = Column(Integer, ForeignKey("ingestion_runs.id"), nullable=True, index=True)
    source_record_id = Column(String(128), nullable=True, index=True)
    table_name = Column(String(64), nullable=False)
    severity = Column(String(16), nullable=False, index=True)  # ERROR, WARNING, INFO
    issue_type = Column(String(64), nullable=False, index=True)
    column_name = Column(String(64), nullable=True)
    raw_value = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    ingestion_run = relationship("IngestionRun", back_populates="quality_issues")


class RiskAnalysis(Base):
    """Stores the aggregated risk assessment run for a trade transaction or corridor."""
    __tablename__ = "risk_analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    analysis_id = Column(String(36), unique=True, nullable=False, index=True)
    trade_record_id = Column(Integer, ForeignKey("normalized_trade_records.id"), nullable=True, index=True)
    commodity_code = Column(String(32), nullable=False, index=True)
    mineral_type = Column(String(64), nullable=True)
    reporter_country_code = Column(String(16), nullable=False, index=True)
    partner_country_code = Column(String(16), nullable=False, index=True)
    period = Column(String(32), nullable=False, index=True)
    
    combined_anomaly_score = Column(Float, nullable=False)
    score_completeness = Column(String(32), nullable=False, index=True)  # COMPLETE, PARTIAL, UNAVAILABLE
    evaluated_rules = Column(Text, nullable=False)    # JSON string list, e.g. ["R1", "R2"]
    insufficient_rules = Column(Text, nullable=False) # JSON string list
    flagged_rules = Column(Text, nullable=False)      # JSON string list
    
    sanctions_status = Column(String(32), nullable=False, default="UNKNOWN", index=True)
    sanctions_reference = Column(Text, nullable=True)

    # Phase 3: Risk Classification Engine
    classification = Column(String(32), nullable=True, index=True)  # GREEN, AMBER, RED, INSUFFICIENT_DATA
    flag_status = Column(String(32), nullable=True, index=True)     # FLAGGED, NOT_FLAGGED, INSUFFICIENT_DATA
    classification_explanation = Column(Text, nullable=True)

    created_at = Column(DateTime, default=utc_now, nullable=False)

    trade_record = relationship("NormalizedTradeRecord")
    rule_results = relationship("RiskRuleResult", back_populates="analysis", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_risk_commodity_period", "commodity_code", "period"),
        Index("idx_risk_score_comp", "combined_anomaly_score", "score_completeness"),
        Index("idx_risk_classification", "classification", "flag_status"),
    )


class RiskRuleResult(Base):
    """Detailed rule-level evaluation audit record."""
    __tablename__ = "risk_rule_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    analysis_id = Column(String(36), ForeignKey("risk_analyses.analysis_id"), nullable=False, index=True)
    rule_id = Column(String(16), nullable=False, index=True)  # R1, R2, R3, R4, R5
    rule_name = Column(String(64), nullable=False)
    rule_version = Column(String(16), default="1.0", nullable=False)
    weight = Column(Integer, default=0, nullable=False)
    outcome = Column(String(32), nullable=False, index=True)  # FLAG, NOT_FLAGGED, INSUFFICIENT_DATA, etc.
    threshold = Column(String(128), nullable=False)
    formula = Column(String(255), nullable=False)
    calculated_value = Column(Float, nullable=True)
    input_values = Column(Text, nullable=False)  # JSON formatted inputs
    explanation = Column(Text, nullable=False)
    warnings = Column(Text, nullable=True)       # JSON formatted warnings
    created_at = Column(DateTime, default=utc_now, nullable=False)

    analysis = relationship("RiskAnalysis", back_populates="rule_results")


class RankingSnapshot(Base):
    """Point-in-time snapshot of trade risk rankings."""
    __tablename__ = "ranking_snapshots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    snapshot_id = Column(String(36), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=True)
    description = Column(Text, nullable=True)
    policy_version = Column(String(16), default="1.0", nullable=False)
    filters_applied = Column(Text, nullable=True)  # JSON dictionary of filters
    total_eligible_count = Column(Integer, default=0, nullable=False)
    excluded_count = Column(Integer, default=0, nullable=False)
    exclusion_reasons = Column(Text, nullable=True)  # JSON breakdown
    created_at = Column(DateTime, default=utc_now, nullable=False)

    items = relationship("RankingSnapshotItem", back_populates="snapshot", cascade="all, delete-orphan")


class RankingSnapshotItem(Base):
    """Individual ranked item within a RankingSnapshot."""
    __tablename__ = "ranking_snapshot_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    snapshot_id = Column(String(36), ForeignKey("ranking_snapshots.snapshot_id"), nullable=False, index=True)
    rank = Column(Integer, nullable=False, index=True)
    analysis_id = Column(String(36), ForeignKey("risk_analyses.analysis_id"), nullable=False, index=True)
    anomaly_score = Column(Float, nullable=False)
    classification = Column(String(32), nullable=True)
    flag_status = Column(String(32), nullable=True)
    commodity_code = Column(String(32), nullable=False)
    mineral_type = Column(String(64), nullable=True)
    reporter_country_code = Column(String(16), nullable=False)
    partner_country_code = Column(String(16), nullable=False)
    period = Column(String(32), nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    snapshot = relationship("RankingSnapshot", back_populates="items")
    analysis = relationship("RiskAnalysis")

    __table_args__ = (
        Index("idx_snapshot_item_rank", "snapshot_id", "rank"),
    )


class EvidenceSnapshot(Base):
    """Immutable evidence snapshot preserving all data inputs, rule outputs, and context for an analysis."""
    __tablename__ = "evidence_snapshots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    evidence_id = Column(String(36), unique=True, nullable=False, index=True)
    analysis_id = Column(String(36), ForeignKey("risk_analyses.analysis_id"), unique=True, nullable=False, index=True)
    schema_version = Column(String(16), default="1.0", nullable=False)

    # Source dataset and record references
    trade_record_id = Column(Integer, ForeignKey("normalized_trade_records.id"), nullable=True, index=True)
    source_dataset_name = Column(String(64), nullable=False, default="UN Comtrade")
    source_record_id = Column(String(128), nullable=True, index=True)
    source_reference_url = Column(String(512), nullable=True)
    source_retrieval_timestamp = Column(DateTime, nullable=True)
    source_payload_snapshot = Column(Text, nullable=False)  # JSON snapshot of trade record fields

    # Analysis outputs snapshot
    analysis_timestamp = Column(DateTime, nullable=False)
    combined_anomaly_score = Column(Float, nullable=False)
    score_completeness = Column(String(32), nullable=False, index=True)
    evaluated_rules = Column(Text, nullable=False)    # JSON list
    insufficient_rules = Column(Text, nullable=False) # JSON list
    flagged_rules = Column(Text, nullable=False)      # JSON list
    sanctions_status = Column(String(32), default="UNKNOWN", nullable=False)
    sanctions_reference = Column(Text, nullable=True)

    # Phase 3 classification evidence snapshot
    classification = Column(String(32), nullable=True, index=True)
    flag_status = Column(String(32), nullable=True, index=True)
    classification_explanation = Column(Text, nullable=True)
    classification_policy_version = Column(String(16), default="1.0", nullable=False)
    classification_thresholds_applied = Column(Text, nullable=True)  # JSON dictionary

    # Phase 4 ranking context snapshot
    ranking_context = Column(Text, nullable=True)  # JSON dictionary

    # Rule-by-rule evaluations snapshot
    rule_evaluations_snapshot = Column(Text, nullable=False)  # JSON list of rule calculations

    # Data quality warnings
    data_quality_warnings = Column(Text, nullable=True)  # JSON list

    # Validation tracking
    validation_status = Column(String(32), default="UNVALIDATED", nullable=False, index=True)  # VALID, INVALID, WARNINGS, UNVALIDATED
    validation_report = Column(Text, nullable=True)  # JSON dictionary of validation checks
    last_validated_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=utc_now, nullable=False)

    analysis = relationship("RiskAnalysis", backref="evidence_snapshot")
    trade_record = relationship("NormalizedTradeRecord")


class AuditEvent(Base):
    """Append-only audit log for backend operational events and evidence tracking."""
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_id = Column(String(36), unique=True, nullable=False, index=True)
    event_type = Column(String(64), nullable=False, index=True)
    timestamp = Column(DateTime, default=utc_now, nullable=False, index=True)
    related_record_id = Column(String(128), nullable=True, index=True)
    operation_status = Column(String(32), default="SUCCESS", nullable=False, index=True)  # SUCCESS, FAILED, WARNING
    event_metadata = Column(Text, nullable=True)  # JSON dictionary
    error_details = Column(Text, nullable=True)    # Safe sanitized string, no stack traces
    created_at = Column(DateTime, default=utc_now, nullable=False)

    __table_args__ = (
        Index("idx_audit_type_time", "event_type", "timestamp"),
        Index("idx_audit_status_time", "operation_status", "timestamp"),
    )


class GeneratedReport(Base):
    """Metadata record for generated PDF evidence reports."""
    __tablename__ = "generated_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(String(36), unique=True, nullable=False, index=True)
    analysis_id = Column(String(36), ForeignKey("risk_analyses.analysis_id"), nullable=False, index=True)
    evidence_snapshot_id = Column(String(36), nullable=True, index=True)
    template_version = Column(String(16), default="1.0", nullable=False)
    report_title = Column(String(128), default="Critical Mineral Supply-Chain Risk Assessment", nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size_bytes = Column(Integer, nullable=True)
    content_hash = Column(String(64), nullable=True)  # SHA-256 of generated PDF
    report_status = Column(String(32), default="COMPLETED", nullable=False, index=True)
    has_evidence_snapshot = Column(Boolean, default=True, nullable=False)
    has_validated_ai_explanation = Column(Boolean, default=False, nullable=False)
    notes = Column(Text, nullable=True)
    metadata_snapshot = Column(Text, nullable=True)  # JSON summary
    created_at = Column(DateTime, default=utc_now, nullable=False, index=True)

    analysis = relationship("RiskAnalysis", backref="generated_reports")

    __table_args__ = (
        Index("idx_reports_analysis_time", "analysis_id", "created_at"),
    )



