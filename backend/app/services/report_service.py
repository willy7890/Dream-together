from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.report import ContentReport
from app.schemas.report import ReportCreate


def create_report(db: Session, reporter_id: int, payload: ReportCreate) -> ContentReport:
    report = ContentReport(
        reporter_id=reporter_id,
        target_type=payload.target_type,
        target_id=payload.target_id,
        reason=payload.reason,
        status="open",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def list_reports(db: Session, status: str | None = None) -> list[ContentReport]:
    query = db.query(ContentReport)
    if status:
        query = query.filter(ContentReport.status == status)
    return query.order_by(ContentReport.id.desc()).all()


def resolve_report(db: Session, report: ContentReport, status: str) -> ContentReport:
    report.status = status
    db.commit()
    db.refresh(report)
    return report