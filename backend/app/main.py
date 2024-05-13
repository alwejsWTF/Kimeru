from datetime import datetime, timedelta

from flask import Flask, request, jsonify
import flask_jwt_extended as fje
from sqlalchemy import create_engine, select, exists
from sqlalchemy.orm import sessionmaker
from werkzeug.security import check_password_hash

import random
import logging
import threading

from app.auth.authentication import Authentication
from app.models.test import Test
from app.models.task import Task
from app.models.user import User
from app.ranking.ranking import Ranking
from app.executor import process_submission
from config import Config

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SAMESITE"] = "None"
app.config["JWT_COOKIE_SECURE"] = True
engine = create_engine(Config.CREDENTIALS)
Session = sessionmaker(engine)
jwt = fje.JWTManager(app)
auth = Authentication(Session)
ranking = Ranking(Session)

SUPPORTED_LANGUAGES = {'c', 'python'}

BUSY_PORTS = set()
PORTS_LOCK = threading.Lock()
BUSY_PORTS_LIMIT = 100
MIN_PORT = 49152
MAX_PORT = 65536
PORT_ALLOC_RETRIES_LIMIT = 10


def initialize_app():
    return app


@jwt.token_in_blocklist_loader
def check_jwt_revoked(jwt_header, jwt_payload: dict) -> bool:
    return auth.is_jwt_revoked(jwt_header, jwt_payload)


@app.route("/")
def test_page():
    return "<h1>Hello World!</h1>"


@app.post("/register")
def register():
    user_credentials = request.json
    if auth.check_username_exists(user_credentials["nickname"]):
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
        response = jsonify({"message": "Successfully loged in"})
        fje.set_access_cookies(response, token, max_age=timedelta(minutes=30))
        headers = response.__dict__['headers'].getlist("Set-Cookie")
        modified_headers = add_partitioned_header(headers)
        response.__dict__["headers"].setlist("Set-Cookie", modified_headers)
        return response, 200
    else:
        response = {"message": "Incorrect password"}
        return response, 400


def add_partitioned_header(cookies):
    lst = []
    for cookie in cookies:
        lst.append(cookie + "; Partitioned")
    return lst


@app.post("/logout")
@fje.jwt_required()
def logout():
    jti = fje.get_jwt()["jti"]
    now = datetime.now()
    auth.block_token(jti, now)
    response = jsonify({"message": "Successfully loged out"})
    fje.unset_jwt_cookies(response)
    return response, 200


@app.get("/profile")
@fje.jwt_required()
def get_profile():
    identity = fje.get_jwt_identity()
    with Session() as session:
        user_exists = session.scalar(exists()
                                     .where(User.nick == identity).select())
        if user_exists:
            user = auth.get_user(identity)
            response = {"username": user.nick,
                        "id": user.id}
            return response, 200
        else:
            response = {"message": "User cannot be found"}
            return response, 404


@app.post("/problems/<problem_id>/submit")
def submit(problem_id):
    req = request.get_json()
    if 'lang' not in req:
        return jsonify(message='No language specified'), 400
    if 'code' not in req:
        return jsonify(message='No source code provided'), 400
    if req['lang'] not in SUPPORTED_LANGUAGES:
        return jsonify(
            message=f"The {req['lang']} language is not supported"
        ), 400

    statement = select(Test).filter_by(task=problem_id)
    tests = []
    with Session() as session:
        if not session.scalar(exists().where(Task.id == problem_id).select()):
            return jsonify(
                message=f"The problem with id {problem_id} does not exists"
            ), 400
        testObjs = session.scalars(statement).all()
        for t in testObjs:
            tests.append({
                "input": t.input,
                "expected": t.expected_output,
            })

    port = -1
    try:
        PORTS_LOCK.acquire()

        if len(BUSY_PORTS) > BUSY_PORTS_LIMIT:
            return jsonify(message="Too much traffic. Come back later"), 500

        port = random.randint(MIN_PORT, MAX_PORT + 1)
        alloc_try = 0
        while port in BUSY_PORTS:
            port = random.randint(MIN_PORT, MAX_PORT + 1), 500
            alloc_try += 1
            if alloc_try >= PORT_ALLOC_RETRIES_LIMIT:
                return jsonify(message="Failed to allocate port"), 500

        BUSY_PORTS.add(port)
        logging.debug(f"Aquired {port} port")
    finally:
        PORTS_LOCK.release()

    if port not in range(MIN_PORT, MAX_PORT + 1):
        return jsonify(message="What the hell?!"), 500

    result = process_submission(req['lang'], req['code'], tests, port)

    try:
        PORTS_LOCK.acquire()
        BUSY_PORTS.remove(port)
    finally:
        PORTS_LOCK.release()
    return result


@app.get("/started_tasks/<user_id>")
def get_started_tasks(user_id):
    if not auth.check_user_exists(user_id):
        response = {"message": "User with given ID does not exist"}
        return response, 404
    tasks = ranking.get_user_tasks(user_id)
    return tasks, 200
