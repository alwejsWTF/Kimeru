
CREATE TABLE "User" (
	id SERIAL PRIMARY KEY,
	nick VARCHAR,
	password VARCHAR
);
CREATE TABLE Task (
	id SERIAL PRIMARY KEY,
	description VARCHAR
);
CREATE TABLE StartedTasks (
	"user" INT REFERENCES "User"(id),
	task INT REFERENCES Task(id),
	solved BOOLEAN	
);
CREATE TABLE Tag (
	id SERIAL PRIMARY KEY,
	name VARCHAR
);
CREATE TABLE Task_Tag (
	task INT REFERENCES Task(id),
	tag INT REFERENCES Tag(id)
);
CREATE TABLE Tests (
	id SERIAL PRIMARY KEY,
	task INT REFERENCES Task(id),
	input VARCHAR,
	expected_output VARCHAR
);
CREATE TABLE TokenBlocklist (
	id SERIAL PRIMARY KEY,
	jti UUID NOT NULL,
	creation_time timestamp NOT NULL
);
