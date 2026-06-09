from datetime import date as date_type
from sqlalchemy import func
from sqlalchemy.orm import Session
from models import DailyLog
from schemas import LogEntryIn, LogEntryOut, SummaryOut, Totals, TimeSeriesPoint


def upsert_log(db: Session, entry: LogEntryIn) -> LogEntryOut:
    row = db.query(DailyLog).filter_by(date=entry.date, sector=entry.sector).first()
    if row:
        row.sales = entry.sales
        row.customers = entry.customers
    else:
        row = DailyLog(**entry.model_dump())
        db.add(row)
    db.commit()
    db.refresh(row)
    return LogEntryOut.model_validate(row)


def get_summary(db: Session) -> SummaryOut:
    rows = db.query(DailyLog).order_by(DailyLog.date).all()

    total_sales = sum(r.sales for r in rows)
    total_customers = sum(r.customers for r in rows)
    entry_count = len(rows)

    time_series = [
        TimeSeriesPoint(date=r.date, sales=r.sales, customers=r.customers)
        for r in rows
    ]

    today_str = date_type.today().isoformat()
    today_row = next((r for r in rows if r.date == today_str), None)
    today = LogEntryOut.model_validate(today_row) if today_row else None

    return SummaryOut(
        totals=Totals(
            total_sales=total_sales,
            total_customers=total_customers,
            entry_count=entry_count,
        ),
        time_series=time_series,
        today=today,
    )
