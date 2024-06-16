CREATE TABLE IF NOT EXISTS completed_tasks (
    complete_task_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id BIGINT,
    rate INT,
    description TEXT,
    sended_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
