CREATE TABLE IF NOT EXISTS tasks_files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    caption TEXT,
    file_path VARCHAR(255),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);

