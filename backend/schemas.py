from pydantic import BaseModel
from typing import Optional


class LogEntryIn(BaseModel):
    date: str
    sector: str = "restaurant"
    sales: float
    customers: int


class LogEntryOut(LogEntryIn):
    id: int

    model_config = {"from_attributes": True}


class TimeSeriesPoint(BaseModel):
    date: str
    sales: float
    customers: int


class Totals(BaseModel):
    total_sales: float
    total_customers: int
    entry_count: int


class SummaryOut(BaseModel):
    totals: Totals
    time_series: list[TimeSeriesPoint]
    today: Optional[LogEntryOut]
