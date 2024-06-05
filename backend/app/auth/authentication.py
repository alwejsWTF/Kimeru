from datetime import datetime, timedelta

import flask_jwt_extended as fje
from sqlalchemy import exists, select
from werkzeug.security import generate_password_hash

from app.models.user import User
from app.models.token_blocklist import TokenBlocklist


class Authentication:
    def __init__(self, Session):
        self.Session = Session

    def add_user(self, nickname, password):
        with self.Session() as session:
            user = User(
                    nick=nickname,
                    password=generate_password_hash(password, method="scrypt"))
            session.add(user)
            session.commit()

    def check_username_exists(self, nickname):
        with self.Session() as session:
            return session.scalar(exists()
                                  .where(User.nick == nickname).select())

    def check_user_exists(self, user_id):
        with self.Session() as session:
            return session.scalar(exists()
                                  .where(User.id == user_id).select())

    def get_user(self, nickname):
        with self.Session() as session:
            statement = select(User).filter_by(nick=nickname)
            user_obj = session.scalars(statement).first()
            return user_obj

    def block_token(self, jti, time):
        with self.Session() as session:
            token = TokenBlocklist(jti=jti,
                                   creation_time=time)
            session.add(token)
            session.commit()

    def is_jwt_revoked(self, jwt_header, jwt_payload: dict) -> bool:
        with self.Session() as session:
            jti = jwt_payload["jti"]
            token = session.scalar(select(TokenBlocklist.id)
                                   .filter_by(jti=jti))
            return token is not None

    def add_partitioned_header(self, cookies):
        lst = []
        for cookie in cookies:
            lst.append(cookie + "; Partitioned;")
        return lst

    def refresh_expiring_jwts(self, response):
        try:
            exp_timestamp = fje.get_jwt()["exp"]
            now = datetime.now()
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                jwt = fje.create_access_token(identity=fje.get_jwt_identity())
                fje.set_access_cookies(response, jwt)
                headers = response.__dict__['headers'].getlist("Set-Cookie")
                modified_headers = self.add_partitioned_header(headers)
                response.__dict__["headers"].setlist("Set-Cookie",
                                                     modified_headers)
            return response
        except (RuntimeError, KeyError):
            return response
