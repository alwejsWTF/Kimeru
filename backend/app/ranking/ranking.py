from sqlalchemy import select

from app.models.started_tasks import StartedTasks
from app.models.task import Task
from app.models.user import User


class Ranking:
    def __init__(self, Session):
        self.Session = Session

    def get_user_tasks(self, user_id):
        with self.Session() as session:
            tasks = {"task_ids": [],
                     "descriptions": [],
                     "solve_status": []}
            statement = (select(Task.id, Task.description, StartedTasks.solved)
                         .join_from(User, StartedTasks)
                         .join_from(StartedTasks, Task)
                         .where(User.id == user_id))
            for row in session.execute(statement):
                tasks["task_ids"].append(row[0])
                tasks["descriptions"].append(row[1])
                tasks["solve_status"].append(row[2])
            return tasks
