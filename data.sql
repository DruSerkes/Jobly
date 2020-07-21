\c jobly

DROP TABLE jobs;
DROP TABLE companies;
DROP TABLE users;


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
    company_handle TEXT REFERENCES companies ON DELETE CASCADE,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_handle) REFERENCES companies (handle)
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