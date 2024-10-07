# Kimeru

A platform for solving competitive programming challenges.

<p align="center">
  <img src="https://github.com/user-attachments/assets/62e65f00-d569-468d-8282-b06240410cae" />
</p>

## Prerequisites

* [Docker](https://www.docker.com/)
* [Python](https://www.python.org/)
* [Flask](https://flask.palletsprojects.com/)
* [NodeJS](https://nodejs.org/)

## Running

Open up a terminal and enter the following:
```console
$ docker-compose -f backend/docker-compose.yaml up
```
Note that, depending on the platform, you may need to replace `docker-compose` with `docker compose`.

Open up another terminal window/tab and enter the following:
```console
$ python -m venv venv
$ . ./venv/bin/activate
$ pip install -r requirements.txt
$ flask --app backend/app run
```
Note that, the second command differs depending on the platform and shell.
[Here](https://docs.python.org/3/library/venv.html#how-venvs-work) you can find the exact command you need to use.

Open up yet another terminal window/tab and enter the following:
```console
$ npm start --prefix frontend
```

Finally, go to <http://127.0.0.1:3000> (<http://localhost:3000> will not work properly).

## License

[MIT](https://github.com/alwejsWTF/Kimeru/blob/main/LICENSE)
