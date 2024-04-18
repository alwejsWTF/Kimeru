from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from app.models.task import Task


class Base(DeclarativeBase):
    pass


class Test(Base):
    __tablename__ = "tests"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    task: Mapped[int] = mapped_column(ForeignKey(Task.id))
    input: Mapped[str] = mapped_column()
    expected_output: Mapped[str] = mapped_column()
