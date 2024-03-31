from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
	pass

class User(Base):
    __tablename__ = "User"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nick: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column()
