from datetime import datetime

from flask import Flask, request
import flask_jwt_extended as fje
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from werkzeug.security import check_password_hash

from app.auth.authentication import Authentication
from config import Config

app = Flask(__name__)
engine = create_engine(Config.CREDENTIALS)
Session = sessionmaker(engine)
jwt = fje.JWTManager(app)
auth = Authentication(Session)


def initialize_app():
    return app


@jwt.token_in_blocklist_loader
def check_jwt_revoked(jwt_header, jwt_payload: dict) -> bool:
    return auth.is_jwt_revoked(jwt_header, jwt_payload)


@app.route("/")
@fje.jwt_required()
def test_page():
    return "<h1>Hello World!</h1>"


@app.post("/register")
def register():
    user_credentials = request.json
    if auth.check_user_exists(user_credentials["nickname"]):
        response = {"message": "User with given nick already exists"}
        return response, 400
    else:
        auth.add_user(user_credentials["nickname"],
                      user_credentials["password"])
        response = {"message": "User successfully added"}
        return response, 200


@app.post("/login")
def login():
    credentials = request.json
    user = auth.get_user(credentials["nickname"])
    if user is None:
        response = {"message": "Incorrect nickname"}
        return response, 400
    if check_password_hash(user.password, credentials["password"]):
        token = fje.create_access_token(identity=user.nick)
        response = {"message": "Successfully loged in",
                    "token": token}
        return response, 200
    else:
        response = {"message": "Incorrect password"}
        return response, 400


@app.delete("/logout")
@fje.jwt_required()
def logout():
    jti = fje.get_jwt()["jti"]
    now = datetime.now()
    auth.block_token(jti, now)
    response = {"message": "Successfully loged out"}
    return response, 200
