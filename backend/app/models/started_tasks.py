from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from app.models.task import Task
from app.models.user import User


class Base(DeclarativeBase):
    pass


class StartedTasks(Base):
    __tablename__ = "startedtasks"
    user: Mapped[int] = mapped_column(ForeignKey(User.id), primary_key=True)
    task: Mapped[int] = mapped_column(ForeignKey(Task.id), primary_key=True)
    solved: Mapped[bool] = mapped_column()
