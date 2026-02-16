CREATE SCHEMA IF NOT EXISTS tasks;

CREATE TABLE IF NOT EXISTS tasks.tasks_runs (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    trigger VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    definition TEXT NOT NULL,
    credits_consumed INT DEFAULT 0,
    CONSTRAINT workflow_id_fk FOREIGN KEY(task_id) REFERENCES tasks.tasks(id) ON DELETE CASCADE,
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users.users(id) ON DELETE CASCADE
);