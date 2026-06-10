from sqlalchemy import Column, Integer, String, Float, UniqueConstraint
from database import Base


class DailyLog(Base):
    __tablename__ = "daily_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(String, nullable=False)
    sector = Column(String, nullable=False)
    location = Column(String, nullable=False)
    sales = Column(Float, nullable=False)
    customers = Column(Integer, nullable=False)

    __table_args__ = (UniqueConstraint("date", "sector", "location", name="uq_date_sector_location"),)
