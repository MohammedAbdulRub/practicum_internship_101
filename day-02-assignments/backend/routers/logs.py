from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import LogEntryIn, LogEntryOut, SummaryOut
import crud

router = APIRouter(prefix="/api")


@router.post("/log", response_model=LogEntryOut, status_code=status.HTTP_201_CREATED)
def create_or_update_log(entry: LogEntryIn, db: Session = Depends(get_db)):
    return crud.upsert_log(db, entry)


@router.get("/summary", response_model=SummaryOut)
def get_summary(
    location: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    return crud.get_summary(db, location)
