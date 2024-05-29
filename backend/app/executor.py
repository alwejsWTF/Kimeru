import docker

from docker.utils.utils import json
from docker.errors import ImageNotFound

import urllib3
import time

docker_client = docker.from_env()

IMAGE_NAME = "judge"


def load_image():
    print(f"Loading \"{IMAGE_NAME}\" image...")
    try:
        docker_client.images.get(IMAGE_NAME)
        print("Image already loaded")
    except ImageNotFound:
        print("Creating image from Dockerfile...")
        docker_client.images.build(path="./app/verifier/", tag=IMAGE_NAME)


def process_submission(lang, code, tests, port):
    load_image()

    container_name = f"{IMAGE_NAME}-{port}"
    command = f"flask --app verifier run --host=0.0.0.0 -p {port}"

    res = {"status": "failure"}
    try:
        docker_client.containers.run(IMAGE_NAME,
                                     detach=True,
                                     ports={port: port},
                                     name=container_name,
                                     command=command)

        data = {
            "lang": lang,
            "code": code,
            "tests": tests,
        }
        http = urllib3.PoolManager()
        time.sleep(1)
        req = http.request('POST',
                           f"http://127.0.0.1:{port}/",
                           headers={'Content-Type': 'application/json'},
                           body=json.dumps(data).encode("utf-8"))

        res = json.loads(req.data.decode("utf-8"))
    except Exception:
        pass

    container = docker_client.containers.get(container_name)
    container.kill()
    container.remove()

    return res
