from flask_login import UserMixin
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base, UserMixin):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nick: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column()
