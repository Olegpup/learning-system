CREATE TABLE IF NOT EXISTS group_students (
    group_id INT,
    user_id BIGINT,
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

