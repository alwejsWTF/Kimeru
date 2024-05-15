import datetime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base


class TokenBlocklist(Base):
    __tablename__ = 'token_blocklist'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    jti: Mapped[str] = mapped_column(nullable=False)
    creation_time: Mapped[datetime.datetime] = mapped_column(nullable=False)
