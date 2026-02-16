CREATE SCHEMA IF NOT EXISTS tasks;

CREATE TABLE IF NOT EXISTS tasks.task_tags (
    tag_id INT NOT NULL,
    task_id INT NOT NULL,
    CONSTRAINT pk_tag_tasks PRIMARY KEY(tag_id,task_id),
    CONSTRAINT fk_task_tags_tag FOREIGN KEY(tag_id) REFERENCES tasks.tags(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_tags_task FOREIGN KEY(task_id) REFERENCES tasks.tasks(id) ON DELETE CASCADE
);