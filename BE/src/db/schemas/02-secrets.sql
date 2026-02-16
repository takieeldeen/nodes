CREATE SCHEMA IF NOT EXISTS tasks;

CREATE TABLE IF NOT EXISTS tasks.secrets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    env TEXT NOT NULL DEFAULT 'DEFAULT',
    user_id INT NOT NULL,
    UNIQUE (name, user_id,env),
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users.users(id) ON DELETE CASCADE 
);
