"""Repository pattern data access layer for MineTrace database operations."""
from datetime import datetime
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_

from app.database.models import (
    DataSourceMetadata,
    IngestionRun,
    RawTradeRecord,
    NormalizedTradeRecord,
    OfacSanctionRecord,
    DataQualityIssue,
    RiskAnalysis,
    RiskRuleResult,
    utc_now,
)


class MineTraceRepository:
    """Encapsulates all database query and persistence methods."""

    def __init__(self, db: Session):
        self.db = db

    # -------------------------------------------------------------
    # Metadata & Ingestion Runs
    # -------------------------------------------------------------
    def get_or_create_data_source(self, source_name: str, source_url: str, description: str = None) -> DataSourceMetadata:
        source = self.db.query(DataSourceMetadata).filter(DataSourceMetadata.source_name == source_name).first()
        if not source:
            source = DataSourceMetadata(
                source_name=source_name,
                source_url=source_url,
                description=description,
                last_status="NEVER_RUN",
                total_records_ingested=0,
            )
            self.db.add(source)
            self.db.commit()
            self.db.refresh(source)
        return source

    def update_data_source_status(
        self,
        source_name: str,
        status: str,
        successful: bool,
        records_added: int = 0,
    ) -> Optional[DataSourceMetadata]:
        source = self.db.query(DataSourceMetadata).filter(DataSourceMetadata.source_name == source_name).first()
        if source:
            source.last_status = status
            source.last_attempt_timestamp = utc_now()
            if successful:
                source.last_successful_retrieval = utc_now()
                source.total_records_ingested += records_added
            self.db.commit()
            self.db.refresh(source)
        return source

    def create_ingestion_run(
        self,
        source_name: str,
        run_type: str = "MANUAL",
        parameters: str = None,
    ) -> IngestionRun:
        run = IngestionRun(
            source_name=source_name,
            run_type=run_type,
            status="RUNNING",
            parameters=parameters,
            started_at=utc_now(),
        )
        self.db.add(run)
        self.db.commit()
        self.db.refresh(run)
        return run

    def finish_ingestion_run(
        self,
        run_id: int,
        status: str,
        raw_count: int,
        clean_count: int,
        error_count: int,
        warning_count: int,
        error_message: Optional[str] = None,
    ) -> IngestionRun:
        run = self.db.query(IngestionRun).filter(IngestionRun.id == run_id).first()
        if run:
            run.status = status
            run.completed_at = utc_now()
            run.raw_records_count = raw_count
            run.clean_records_count = clean_count
            run.error_count = error_count
            run.warning_count = warning_count
            run.error_message = error_message
            self.db.commit()
            self.db.refresh(run)
        return run

    def log_quality_issue(
        self,
        table_name: str,
        severity: str,
        issue_type: str,
        message: str,
        ingestion_run_id: Optional[int] = None,
        source_record_id: Optional[str] = None,
        column_name: Optional[str] = None,
        raw_value: Optional[str] = None,
    ) -> DataQualityIssue:
        issue = DataQualityIssue(
            ingestion_run_id=ingestion_run_id,
            source_record_id=source_record_id,
            table_name=table_name,
            severity=severity,
            issue_type=issue_type,
            column_name=column_name,
            raw_value=str(raw_value)[:255] if raw_value is not None else None,
            message=message,
        )
        self.db.add(issue)
        self.db.commit()
        return issue

    # -------------------------------------------------------------
    # Trade Records (Raw & Normalized)
    # -------------------------------------------------------------
    def save_raw_trade_record(
        self,
        raw_payload: str,
        retrieval_timestamp: datetime,
        ingestion_run_id: Optional[int] = None,
        source_record_id: Optional[str] = None,
        commodity_code: Optional[str] = None,
        period: Optional[str] = None,
        reporter_code: Optional[str] = None,
        partner_code: Optional[str] = None,
    ) -> RawTradeRecord:
        record = RawTradeRecord(
            ingestion_run_id=ingestion_run_id,
            source_record_id=source_record_id,
            commodity_code=commodity_code,
            period=period,
            reporter_code=reporter_code,
            partner_code=partner_code,
            raw_payload=raw_payload,
            retrieval_timestamp=retrieval_timestamp,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_normalized_record_by_hash(self, record_hash: str) -> Optional[NormalizedTradeRecord]:
        return self.db.query(NormalizedTradeRecord).filter(NormalizedTradeRecord.record_hash == record_hash).first()

    def save_normalized_trade_record(self, record_dict: Dict[str, Any]) -> Tuple[NormalizedTradeRecord, bool]:
        """Saves a normalized trade record. Returns (record, is_created)."""
        existing = self.get_normalized_record_by_hash(record_dict["record_hash"])
        if existing:
            return existing, False

        record = NormalizedTradeRecord(**record_dict)
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record, True

    def list_trade_records(
        self,
        skip: int = 0,
        limit: int = 50,
        commodity_code: Optional[str] = None,
        reporter_country_code: Optional[str] = None,
        partner_country_code: Optional[str] = None,
        flow_type: Optional[str] = None,
        period_year: Optional[int] = None,
    ) -> Tuple[List[NormalizedTradeRecord], int]:
        """Lists trade records with filtering and pagination. Returns (records, total_count)."""
        query = self.db.query(NormalizedTradeRecord)
        
        conditions = []
        if commodity_code:
            conditions.append(NormalizedTradeRecord.commodity_code == commodity_code.strip())
        if reporter_country_code:
            conditions.append(NormalizedTradeRecord.reporter_country_code == reporter_country_code.strip().upper())
        if partner_country_code:
            conditions.append(NormalizedTradeRecord.partner_country_code == partner_country_code.strip().upper())
        if flow_type:
            conditions.append(NormalizedTradeRecord.flow_type == flow_type.strip().upper())
        if period_year:
            conditions.append(NormalizedTradeRecord.period_year == period_year)

        if conditions:
            query = query.filter(and_(*conditions))

        total = query.count()
        records = query.order_by(desc(NormalizedTradeRecord.period_year), NormalizedTradeRecord.id).offset(skip).limit(limit).all()
        return records, total

    def get_distinct_minerals(self) -> List[Dict[str, Any]]:
        """Returns distinct commodity codes and mineral types present in the database."""
        results = (
            self.db.query(
                NormalizedTradeRecord.commodity_code,
                NormalizedTradeRecord.commodity_description,
                NormalizedTradeRecord.mineral_type,
                func.count(NormalizedTradeRecord.id).label("record_count"),
            )
            .group_by(
                NormalizedTradeRecord.commodity_code,
                NormalizedTradeRecord.commodity_description,
                NormalizedTradeRecord.mineral_type,
            )
            .all()
        )
        return [
            {
                "commodity_code": r[0],
                "description": r[1],
                "mineral_type": r[2],
                "record_count": r[3],
            }
            for r in results
        ]

    # -------------------------------------------------------------
    # OFAC Sanctions Records
    # -------------------------------------------------------------
    def get_ofac_record_by_hash(self, record_hash: str) -> Optional[OfacSanctionRecord]:
        return self.db.query(OfacSanctionRecord).filter(OfacSanctionRecord.record_hash == record_hash).first()

    def save_ofac_sanction_record(self, record_dict: Dict[str, Any]) -> Tuple[OfacSanctionRecord, bool]:
        """Saves an OFAC sanction record. Returns (record, is_created)."""
        existing = self.get_ofac_record_by_hash(record_dict["record_hash"])
        if existing:
            return existing, False

        record = OfacSanctionRecord(**record_dict)
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record, True

    def list_sanctions_records(
        self,
        skip: int = 0,
        limit: int = 50,
        country: Optional[str] = None,
        entity_type: Optional[str] = None,
    ) -> Tuple[List[OfacSanctionRecord], int]:
        query = self.db.query(OfacSanctionRecord)
        if country:
            query = query.filter(OfacSanctionRecord.country.ilike(f"%{country.strip()}%"))
        if entity_type:
            query = query.filter(OfacSanctionRecord.entity_type == entity_type.strip().lower())
            
        total = query.count()
        records = query.order_by(OfacSanctionRecord.primary_name).offset(skip).limit(limit).all()
        return records, total

    # -------------------------------------------------------------
    # System Status & Health
    # -------------------------------------------------------------
    def get_system_status(self) -> Dict[str, Any]:
        """Aggregates data freshness, counts, and metadata for status endpoint."""
        sources = self.db.query(DataSourceMetadata).all()
        total_trade_records = self.db.query(NormalizedTradeRecord).count()
        total_sanctions_records = self.db.query(OfacSanctionRecord).count()
        total_raw_records = self.db.query(RawTradeRecord).count()
        total_quality_issues = self.db.query(DataQualityIssue).count()
        
        last_trade_retrieval = (
            self.db.query(func.max(NormalizedTradeRecord.retrieval_timestamp)).scalar()
        )
        last_sanctions_retrieval = (
            self.db.query(func.max(OfacSanctionRecord.retrieval_timestamp)).scalar()
        )

        counts_data = {
            "normalized_trade_records": total_trade_records,
            "raw_trade_records": total_raw_records,
            "sanctions_records": total_sanctions_records,
            "data_quality_issues": total_quality_issues,
        }

        return {
            "sources": [
                {
                    "source_name": s.source_name,
                    "source_url": s.source_url,
                    "last_status": s.last_status,
                    "last_successful_retrieval": s.last_successful_retrieval,
                    "last_attempt_timestamp": s.last_attempt_timestamp,
                    "total_records_ingested": s.total_records_ingested,
                }
                for s in sources
            ],
            "counts": counts_data,
            "record_counts": counts_data,
            "last_successful_retrieval": {
                "trade": last_trade_retrieval,
                "sanctions": last_sanctions_retrieval,
            },
        }

    # -------------------------------------------------------------
    # Phase 2: Risk Analyses & Rule Audits
    # -------------------------------------------------------------
    def get_risk_analysis_by_id(self, analysis_id: str) -> Optional[RiskAnalysis]:
        """Retrieves a single complete risk analysis with child rule results."""
        return (
            self.db.query(RiskAnalysis)
            .filter(RiskAnalysis.analysis_id == analysis_id.strip())
            .first()
        )

    def list_risk_analyses(
        self,
        skip: int = 0,
        limit: int = 50,
        commodity_code: Optional[str] = None,
        score_completeness: Optional[str] = None,
        min_score: Optional[float] = None,
        sanctions_status: Optional[str] = None,
    ) -> Tuple[List[RiskAnalysis], int]:
        """Retrieves paginated historical risk analyses without recalculation."""
        query = self.db.query(RiskAnalysis)
        conditions = []

        if commodity_code:
            conditions.append(RiskAnalysis.commodity_code == commodity_code.strip())
        if score_completeness:
            conditions.append(RiskAnalysis.score_completeness == score_completeness.strip().upper())
        if min_score is not None:
            conditions.append(RiskAnalysis.combined_anomaly_score >= min_score)
        if sanctions_status:
            conditions.append(RiskAnalysis.sanctions_status == sanctions_status.strip().upper())

        if conditions:
            query = query.filter(and_(*conditions))

        total = query.count()
        records = query.order_by(desc(RiskAnalysis.created_at), desc(RiskAnalysis.id)).offset(skip).limit(limit).all()
        return records, total

    def get_risk_summary(self) -> Dict[str, Any]:
        """Aggregates summary statistics across stored risk analyses."""
        total = self.db.query(RiskAnalysis).count()
        complete_count = (
            self.db.query(RiskAnalysis)
            .filter(RiskAnalysis.score_completeness == "COMPLETE")
            .count()
        )
        partial_count = (
            self.db.query(RiskAnalysis)
            .filter(RiskAnalysis.score_completeness == "PARTIAL")
            .count()
        )
        unavailable_count = (
            self.db.query(RiskAnalysis)
            .filter(RiskAnalysis.score_completeness == "UNAVAILABLE")
            .count()
        )
        avg_score = (
            self.db.query(func.avg(RiskAnalysis.combined_anomaly_score))
            .filter(RiskAnalysis.score_completeness != "UNAVAILABLE")
            .scalar()
        )

        # Flagged rule breakdown
        flagged_r1 = self.db.query(RiskRuleResult).filter(and_(RiskRuleResult.rule_id == "R1", RiskRuleResult.outcome == "FLAG")).count()
        flagged_r2 = self.db.query(RiskRuleResult).filter(and_(RiskRuleResult.rule_id == "R2", RiskRuleResult.outcome == "FLAG")).count()
        flagged_r3 = self.db.query(RiskRuleResult).filter(and_(RiskRuleResult.rule_id == "R3", RiskRuleResult.outcome == "FLAG")).count()
        flagged_r4 = self.db.query(RiskRuleResult).filter(and_(RiskRuleResult.rule_id == "R4", RiskRuleResult.outcome == "FLAG")).count()

        # Sanctions status breakdown
        sanctions_match = self.db.query(RiskAnalysis).filter(RiskAnalysis.sanctions_status == "REVIEW_MATCH").count()
        sanctions_no_match = self.db.query(RiskAnalysis).filter(RiskAnalysis.sanctions_status == "NO_IDENTIFIED_MATCH").count()
        sanctions_unknown = self.db.query(RiskAnalysis).filter(RiskAnalysis.sanctions_status == "UNKNOWN").count()

        return {
            "total_analyses": total,
            "complete_scores_count": complete_count,
            "partial_scores_count": partial_count,
            "unavailable_scores_count": unavailable_count,
            "average_anomaly_score": round(float(avg_score), 2) if avg_score is not None else None,
            "flagged_rules_breakdown": {
                "R1": flagged_r1,
                "R2": flagged_r2,
                "R3": flagged_r3,
                "R4": flagged_r4,
            },
            "sanctions_status_breakdown": {
                "REVIEW_MATCH": sanctions_match,
                "NO_IDENTIFIED_MATCH": sanctions_no_match,
                "UNKNOWN": sanctions_unknown,
            },
        }
