from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.task_tag import task_tag
from .base import Base


class Tag(Base):
    __tablename__ = 'tag'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column()
    
    tasks = relationship("Task", secondary=task_tag, back_populates="tags")
