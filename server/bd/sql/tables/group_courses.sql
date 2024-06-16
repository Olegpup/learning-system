CREATE TABLE IF NOT EXISTS group_courses (
    group_id INT,
    course_id INT,
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

