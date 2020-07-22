\c
jobly

DROP TABLE companies
CASCADE;
DROP TABLE users
CASCADE;
DROP TABLE jobs
CASCADE;
DROP TABLE applications
CASCADE;


CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees int,
    description text,
    logo_url text,
    join_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs
(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT NOT NULL,
    equity FLOAT NOT NULL CHECK (equity < 1),
    company_handle TEXT REFERENCES companies(handle) ON DELETE CASCADE,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_handle) REFERENCES companies (handle) ON DELETE CASCADE
);

CREATE TABLE users
(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TYPE app_state AS ENUM
('interested', 'applied', 'accepted', 'rejected');


CREATE TABLE applications
(
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    state app_state NOT NULL DEFAULT 'interested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(username, job_id)
);



INSERT INTO companies
    (handle, name)
VALUES
    ('lhfh', 'LHFH Records');

INSERT INTO jobs
    (title, salary, equity, company_handle)
VALUES
    ('producer', 50.00, 0.1, 'lhfh');

INSERT INTO users
    (username, password, first_name, last_name, email)
VALUES
    ('proddy', 'password', 'prod', 'ucer', 'proddy@prod.com');

INSERT INTO applications
    (username, job_id, state)
VALUES
    ('proddy', 1, 'applied')