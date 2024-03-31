from flask import Flask, request
from sqlalchemy import create_engine, exists, select
from config import credentials
from sqlalchemy.orm import Session
from user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager

app = Flask(__name__)
engine = create_engine(credentials)
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return get_user_by_id(user_id) 

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

def get_user_by_id(user_id):
    with Session(engine) as session:
        statement = select(User).filter_by(id=user_id)
        user_obj = session.scalars(statement).first()
        return user_obj

def get_user_by_nickname(nickname):
    with Session(engine) as session:
        statement = select(User).filter_by(nick=nickname)
        user_obj = session.scalars(statement).first()
        return user_obj


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
    credentials = request.json
    user = get_user_by_nickname(credentials["nickname"])
    if user is None:
        response = {"message": "Incorrect nickname"}
        return response, 400
    if check_password_hash(user.password, credentials["password"]):
        load_user(user.id)
        response = {"message": "Successfully loged in"}
        return response, 200
    else:
        response = {"message": "Incorrect password"}
        return response, 400


