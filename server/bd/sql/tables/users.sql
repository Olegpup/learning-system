CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT(30) PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  father_name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  role ENUM('student', 'teacher', 'admin'),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

