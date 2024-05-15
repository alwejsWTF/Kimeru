from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.task_tag import task_tag
from .base import Base


class Task(Base):
    __tablename__ = 'task'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column()
    description: Mapped[str] = mapped_column()
    points: Mapped[int] = mapped_column()

    tags = relationship("Tag", secondary=task_tag, back_populates="tasks")
