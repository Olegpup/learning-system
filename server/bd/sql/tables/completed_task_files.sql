CREATE TABLE IF NOT EXISTS completed_task_files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    complete_task_id INT,
    caption TEXT,
    file_path VARCHAR(255),
    FOREIGN KEY (complete_task_id) REFERENCES completed_tasks(complete_task_id) ON DELETE CASCADE
);