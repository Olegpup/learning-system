CREATE TABLE IF NOT EXISTS courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    author_id BIGINT,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
)

