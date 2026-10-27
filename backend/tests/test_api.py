"""Tests for FastAPI endpoints."""
import pytest
from app.api.routes.health import get_health, get_readiness
from app.api.routes.status import get_data_status
from app.api.routes.ingestion import trigger_trade_ingestion, trigger_sanctions_ingestion
from app.api.routes.trade import list_trade_records, get_minerals
from app.schemas.ingestion import TradeIngestionRequest, SanctionsIngestionRequest


def test_health_endpoint(test_db):
    """Verify /health returns 200 and healthy status."""
    res = get_health(db=test_db)
    assert res.status == "HEALTHY"
    assert res.database_connected is True
    assert res.version is not None


def test_data_status_endpoint(test_db):
    """Verify /api/v1/data/status returns 200 and system metadata."""
    res = get_data_status(db=test_db)
    assert res.status == "OPERATIONAL"
    assert "normalized_trade_records" in res.record_counts


def test_trade_ingestion_endpoint(test_db, comtrade_fixture_path):
    """Verify POST /api/v1/ingestion/trade triggers ingestion using fixture."""
    payload = TradeIngestionRequest(fixture_path=comtrade_fixture_path)
    res = trigger_trade_ingestion(payload=payload, db=test_db)
    assert res.status == "COMPLETED"
    assert res.clean_records_count == 4
    assert res.run_id is not None


def test_trade_records_and_minerals_endpoints(test_db, comtrade_fixture_path):
    """Verify GET /api/v1/trade-records and GET /api/v1/minerals."""
    payload = TradeIngestionRequest(fixture_path=comtrade_fixture_path)
    trigger_trade_ingestion(payload=payload, db=test_db)

    # Test listing all
    data = list_trade_records(skip=0, limit=10, db=test_db)
    assert data.total == 4
    assert len(data.records) == 4

    # Test filter by commodity_code
    data_filter = list_trade_records(skip=0, limit=10, commodity_code="283691", db=test_db)
    assert data_filter.total == 1
    assert data_filter.records[0].commodity_code == "283691"
    assert data_filter.records[0].reporter_country_code == "USA"

    # Test minerals endpoint
    minerals = get_minerals(db=test_db)
    assert len(minerals) >= 1
    codes = [m["commodity_code"] if isinstance(m, dict) else m.commodity_code for m in minerals]
    assert "283691" in codes


def test_sanctions_ingestion_endpoint(test_db, ofac_fixture_path):
    """Verify POST /api/v1/ingestion/sanctions triggers OFAC ingestion."""
    payload = SanctionsIngestionRequest(fixture_path=ofac_fixture_path)
    res = trigger_sanctions_ingestion(payload=payload, db=test_db)
    assert res.status == "COMPLETED"
    assert res.clean_records_count == 3


def test_readiness_endpoint(test_db):
    """Verify Phase 8 /health/readiness diagnostics endpoint."""
    res = get_readiness(db=test_db)
    assert res.status in ["READY", "DEGRADED"]
    assert "database" in res.components
    assert "risk_engine" in res.components
    assert "ranking_engine" in res.components
    assert "pdf_reporting" in res.components
