CREATE TABLE IF NOT EXISTS subgroup_students (
    subgroup_id INT,
    user_id BIGINT,
    FOREIGN KEY (subgroup_id) REFERENCES subgroups(subgroup_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

