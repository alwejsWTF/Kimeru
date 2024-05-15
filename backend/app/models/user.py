from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base


class User(Base, UserMixin):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nick: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column()
