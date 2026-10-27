"""CLI script to run data ingestion for UN Comtrade and OFAC Sanctions."""
import argparse
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.logging import logger
from app.database.connection import SessionLocal, init_db
from app.ingestion.service import IngestionService


def main():
    parser = argparse.ArgumentParser(description="MineTrace Data Ingestion CLI")
    parser.add_argument(
        "--source",
        choices=["trade", "sanctions", "all"],
        default="all",
        help="Data source to ingest (trade, sanctions, or all)",
    )
    parser.add_argument(
        "--trade-fixture",
        type=str,
        default=None,
        help="Path to UN Comtrade JSON fixture file",
    )
    parser.add_argument(
        "--sanctions-fixture",
        type=str,
        default=None,
        help="Path to OFAC SDN CSV fixture file",
    )
    parser.add_argument(
        "--commodity-codes",
        type=str,
        default=None,
        help="Comma-separated HS commodity codes (e.g. 283691,282520)",
    )
    parser.add_argument(
        "--periods",
        type=str,
        default=None,
        help="Comma-separated years or periods (e.g. 2023,2024)",
    )

    args = parser.parse_args()

    # Ensure DB schema is initialized
    init_db()

    db = SessionLocal()
    service = IngestionService(db)

    try:
        # Run trade ingestion
        if args.source in ("trade", "all"):
            codes = [c.strip() for c in args.commodity_codes.split(",")] if args.commodity_codes else None
            periods = [p.strip() for p in args.periods.split(",")] if args.periods else None
            
            logger.info("Starting UN Comtrade trade data ingestion...")
            trade_res = service.ingest_trade_data(
                commodity_codes=codes,
                periods=periods,
                fixture_path=args.trade_fixture,
            )
            logger.info(f"Trade ingestion result: {trade_res['message']}")

        # Run sanctions ingestion
        if args.source in ("sanctions", "all"):
            logger.info("Starting OFAC sanctions data ingestion...")
            sanctions_res = service.ingest_sanctions_data(
                fixture_path=args.sanctions_fixture,
            )
            logger.info(f"Sanctions ingestion result: {sanctions_res['message']}")

        logger.info("All requested ingestion tasks completed successfully.")

    except Exception as exc:
        logger.error(f"Ingestion failed: {exc}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
