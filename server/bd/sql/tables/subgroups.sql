CREATE TABLE IF NOT EXISTS subgroups (
    subgroup_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    leader_id BIGINT,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (leader_id) REFERENCES users(user_id) ON DELETE CASCADE
);

