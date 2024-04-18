import os
import json
import logging
import subprocess

from flask import Flask, request

app = Flask(__name__)

SOURCE_FILES = {
    'c': 'main.c',
    'python': 'main.py',
}

BINARY_FILES = {
    'c': 'main',
    'python': 'main.py',
}

BUILD_COMMANDS = {
    'c': f"gcc {SOURCE_FILES['c']} -o {BINARY_FILES['c']}",
    'python': f"python3 -m py_compile {SOURCE_FILES['python']}",
}

EXECUTE_COMMANDS = {
    'c': "",
    'python': "python3",
}

@app.route("/", methods=['POST'])
def serve():
    if not request.is_json:
        logging.error("Not a JSON")
        return { "error": "Invalid Content-Type: Expected JSON" }

    try:
        content = request.get_json()
        logging.info("Processing submission...")
        logging.info(f"Language: {content['lang']}")

        lang = content['lang']

        with open(SOURCE_FILES[content['lang']], "w") as f:
            f.write(content["code"])
            logging.info(f"Saved the source file: "\
                         f"{SOURCE_FILES[lang]}")

        if os.system(BUILD_COMMANDS[lang]) != 0:
            errmsg = "Failed to compile the solution"
            logging.error(errmsg)
            return { "error": errmsg }

        res = { "test_results": [] }
        for i, test in enumerate(content["tests"]):
            input = test["input"].encode("utf-8")
            expected = test["expected"]

            cmd = [EXECUTE_COMMANDS[lang], BINARY_FILES[lang]] \
                if EXECUTE_COMMANDS[lang] != "" \
                else [f"./{BINARY_FILES[lang]}"]

            result = subprocess.run(cmd, stdout=subprocess.PIPE, input=input)
            output = result.stdout.decode("utf-8").rstrip()

            if result.returncode != 0 or output != expected:
                logging.info(f"Test {i} failed!")
                logging.info(f"Return code: {result.returncode}")
                logging.info(f"Expected: {expected}")
                logging.info(f"Got: {result.stdout}")
                res["test_results"].append(False)
            else:
                print(f"Test {i} passed")
                res["test_results"].append(True)

        return json.dumps(res).encode("utf-8")
    except KeyError:
        return { "error": "Invalid data" }
