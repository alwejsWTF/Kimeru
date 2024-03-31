from flask import Flask, request
from sqlalchemy import create_engine, exists
from config import credentials
from sqlalchemy.orm import Session
from user import User
from werkzeug.security import generate_password_hash

app = Flask(__name__)
engine = create_engine(credentials)

def add_user(nickname, password):
    with Session(engine) as session:
        user = User(
                nick = nickname,
                password = generate_password_hash(password, method="scrypt")) 
        session.add(user)
        session.commit()

def check_user_exists(nickname):
    with Session(engine) as session:
        return session.scalar(exists().where(User.nick == nickname).select())

@app.get("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.post("/register")
def register():
    user_credentials = request.json
    if check_user_exists(user_credentials["nickname"]):
        response = {"message": "User with given nick already exists"}
        return response, 400
    else:
        add_user(user_credentials["nickname"], user_credentials["password"])
        response = {"message": "User successfully added"}
        return response, 200

@app.post("/login")
def login():
   pass 
