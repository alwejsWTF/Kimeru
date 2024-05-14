FROM ubuntu:latest

WORKDIR /app

RUN apt-get update \
    && apt-get install -y \
        gcc \
        python3 \
        python3-flask

COPY verifier.py /app/verifier.py
