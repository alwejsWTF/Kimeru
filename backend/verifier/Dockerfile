FROM ubuntu:latest

WORKDIR /app

RUN apt-get update \
    && apt-get install -y \
        gcc \
        python3 \
        pip
RUN pip install Flask

COPY verifier.py /app/verifier.py
