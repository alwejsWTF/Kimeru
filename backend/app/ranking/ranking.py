from sqlalchemy import select

from app.models.started_tasks import StartedTasks
from app.models.task import Task
from app.models.user import User


class Ranking:
    def __init__(self, Session):
        self.Session = Session

    def get_user_tasks(self, user_id):
        with self.Session() as session:
            tasks = []
            statement = (select(Task.id, Task.description, StartedTasks.solved)
                         .join_from(User, StartedTasks)
                         .join_from(StartedTasks, Task)
                         .where(User.id == user_id))
            for row in session.execute(statement):
                task = {"task_id": row[0],
                        "description": row[1],
                        "solve_status": row[2]}
                tasks.append(task)
            return tasks
