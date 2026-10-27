"""Integration tests for Phase 3 Risk Classification API endpoints."""
import pytest
from fastapi import HTTPException
from app.ingestion.service import IngestionService
from app.risk.service import RiskEngineService
from app.api.routes.classification import (
    get_classification_thresholds,
    classify_analyses,
    list_classified_results,
    get_classified_result_detail,
    get_classification_summary,
)
from app.schemas.classification import ClassifyRequest


def test_get_classification_thresholds_endpoint():
    """Verify GET /api/v1/classification/thresholds returns prototype rules & disclaimer."""
    data = get_classification_thresholds()
    assert "version" in data
    assert "disclaimer" in data
    assert len(data["categories"]) == 4
    cat_names = [c["category"] for c in data["categories"]]
    assert "GREEN" in cat_names
    assert "AMBER" in cat_names
    assert "RED" in cat_names
    assert "INSUFFICIENT_DATA" in cat_names


def test_classify_and_list_results(test_db, comtrade_fixture_path):
    """Verify POST /api/v1/classification/classify and GET /api/v1/classification/results."""
    # Seed trade data and run risk analysis
    ingestion = IngestionService(test_db)
    ingestion.ingest_trade_data(fixture_path=comtrade_fixture_path)
    risk_engine = RiskEngineService(test_db)
    analyses = risk_engine.run_analysis_batch()
    assert len(analyses) > 0
    first_analysis_id = analyses[0].analysis_id

    # Trigger classification endpoint
    classified_items = classify_analyses(ClassifyRequest(), db=test_db)
    assert len(classified_items) >= len(analyses)
    assert all("classification" in item for item in classified_items)
    assert all("flag_status" in item for item in classified_items)

    # Classify specific ID
    single = classify_analyses(ClassifyRequest(analysis_id=first_analysis_id), db=test_db)
    assert len(single) == 1
    assert single[0]["analysis_id"] == first_analysis_id

    # Classify 404
    with pytest.raises(HTTPException) as exc:
        classify_analyses(ClassifyRequest(analysis_id="non-existent-uuid"), db=test_db)
    assert exc.value.status_code == 404

    # List results with pagination
    list_data = list_classified_results(skip=0, limit=10, db=test_db)
    assert list_data.total >= len(classified_items)
    assert len(list_data.analyses) > 0

    # Get single classified result
    detail = get_classified_result_detail(first_analysis_id, db=test_db)
    assert detail["analysis_id"] == first_analysis_id
    assert detail["classification"] in ("GREEN", "AMBER", "RED", "INSUFFICIENT_DATA")


def test_classification_summary_endpoint(test_db, comtrade_fixture_path):
    """Verify GET /api/v1/classification/summary returns aggregated counts."""
    ingestion = IngestionService(test_db)
    ingestion.ingest_trade_data(fixture_path=comtrade_fixture_path)
    risk_engine = RiskEngineService(test_db)
    risk_engine.run_analysis_batch()
    classify_analyses(ClassifyRequest(), db=test_db)

    summary = get_classification_summary(db=test_db)
    assert summary.total_analyses >= 1
    assert summary.classification_breakdown is not None
    assert summary.flag_status_breakdown is not None
