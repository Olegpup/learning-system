CREATE TABLE IF NOT EXISTS groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    teacher_id BIGINT,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
)