CREATE TABLE "user" (
	id SERIAL PRIMARY KEY,
	nick VARCHAR,
	password VARCHAR
);

CREATE TABLE "task" (
	id SERIAL PRIMARY KEY,
	name VARCHAR,
	description VARCHAR,
	points INT
);

CREATE TABLE "started_tasks" (
	"user" INT REFERENCES "user"(id),
	task INT REFERENCES "task"(id),
	solved BOOLEAN	
);

CREATE TABLE "tag" (
	id SERIAL PRIMARY KEY,
	name VARCHAR
);

CREATE TABLE "task_tag" (
	task INT REFERENCES "task"(id),
	tag INT REFERENCES "tag"(id)
);

CREATE TABLE "tests" (
	id SERIAL PRIMARY KEY,
	task INT REFERENCES "task"(id),
	input VARCHAR,
	expected_output VARCHAR
);

CREATE TABLE "token_blocklist" (
	id SERIAL PRIMARY KEY,
	jti UUID NOT NULL,
	creation_time timestamp NOT NULL
);
