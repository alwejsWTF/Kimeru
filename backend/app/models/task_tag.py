from sqlalchemy import ForeignKey, Table, Column, Integer
from .base import Base


task_tag = Table(
    'task_tag',
    Base.metadata,
    Column('task', Integer, ForeignKey('task.id'), primary_key=True),
    Column('tag', Integer, ForeignKey('tag.id'), primary_key=True)
)
