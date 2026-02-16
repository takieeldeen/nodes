CREATE SCHEMA IF NOT EXISTS tasks;

CREATE TABLE IF NOT EXISTS tasks.tasks (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    user_id INT,
    last_run_at TIMESTAMP ,
    last_run_status VARCHAR(255),
    last_run_id INT,
    definition TEXT,
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT last_run_id_fk FOREIGN KEY(last_run_id) REFERENCES tasks.tasks_runs(id) ON DELETE CASCADE
);
