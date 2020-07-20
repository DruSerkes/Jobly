\c jobly
DROP TABLE companies;

CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees int,
    description text,
    logo_url text,
    join_at timestamp DEFAULT CURRENT_TIMESTAMP
);
