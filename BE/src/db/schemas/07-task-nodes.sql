CREATE SCHEMA IF NOT EXISTS tasks;

CREATE TABLE IF NOT EXISTS tasks.tasks_nodes (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    run_id INT NOT NULL,
    node TEXT NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
     CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users.users(id) ON DELETE CASCADE,
     CONSTRAINT run_id_fk FOREIGN KEY(run_id) REFERENCES tasks.tasks_runs(id) ON DELETE CASCADE
);