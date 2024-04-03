from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, exists, select
from config import credentials
from sqlalchemy.orm import Session
from user import User
from werkzeug.security import generate_password_hash, check_password_hash
from secrets import token_hex
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, unset_jwt_cookies, get_jwt
from token_blocklist import TokenBlocklist
from datetime import datetime, timezone

app = Flask(__name__)
app.secret_key = token_hex(16)
cors = CORS(app)
engine = create_engine(credentials)
jwt = JWTManager(app)

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

def get_user(nickname):
    with Session(engine) as session:
        statement = select(User).filter_by(nick=nickname)
        user_obj = session.scalars(statement).first()
        return user_obj

@jwt.token_in_blocklist_loader
def check_jwt_revoked(jwt_header, jwt_payload: dict) -> bool:
    with Session(engine) as session:
        jti = jwt_payload["jti"]        
        token = session.scalar(select(TokenBlocklist.id).filter_by(jti=jti))
        return token is not None

@app.get("/")
@jwt_required()
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
    user = get_user(credentials["nickname"])
    if user is None:
        response = {"message": "Incorrect nickname"}
        return response, 400
    if check_password_hash(user.password, credentials["password"]):
        token = create_access_token(identity=user.nick)
        response = {"message": "Successfully loged in",
                    "token": token}
        return response, 200
    else:
        response = {"message": "Incorrect password"}
        return response, 400

@app.delete("/logout")
@jwt_required()
def logout():
    jti = get_jwt()["jti"] 
    now = datetime.now(timezone.utc)
    with Session(engine) as session:
        token = TokenBlocklist(jti = jti,
                               creation_time = now)
        session.add(token)
        session.commit()
    response = {"message": "Successfully loged out"}
    return response, 200
