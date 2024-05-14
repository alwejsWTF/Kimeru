from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import ForeignKey

from app.models.tag import Tag
from app.models.task import Task


class Base(DeclarativeBase):
    pass


class TaskTag(Base):
    __tablename__ = "task_tag"
    task: Mapped[int] = mapped_column(ForeignKey(Task.id), primary_key=True)
    tag: Mapped[int] = mapped_column(ForeignKey(Tag.id), primary_key=True)
