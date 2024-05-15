from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.models.task import Task
from app.models.user import User
from .base import Base


class StartedTasks(Base):
    __tablename__ = 'started_tasks'
    user: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    task: Mapped[int] = mapped_column(ForeignKey(Task.id), primary_key=True)
    solved: Mapped[bool] = mapped_column()
