import datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
	pass

class TokenBlocklist(Base):
    __tablename__ = "tokenblocklist"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    jti: Mapped[str] = mapped_column(nullable=False)
    creation_time: Mapped[datetime.datetime] = mapped_column(nullable=False)
