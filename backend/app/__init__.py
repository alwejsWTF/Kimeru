from secrets import token_hex

from flask_cors import CORS

from app.main import initialize_app


def create_app():
    app = initialize_app()
    app.secret_key = token_hex(16)
    cors = CORS(app)

    return app
