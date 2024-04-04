import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_USERNAME = os.getenv("POSTGRES_USER")
    DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    DB_HOSTNAME = os.getenv("DB_HOSTNAME")
    DB_NAME = os.getenv("DB_NAME")
    CREDENTIALS = (f"postgresql+psycopg2://{DB_USERNAME}"
                   f":{DB_PASSWORD}@{DB_HOSTNAME}/{DB_NAME}")
