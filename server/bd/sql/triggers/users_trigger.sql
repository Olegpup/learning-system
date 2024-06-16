CREATE TRIGGER IF NOT EXISTS before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  DECLARE new_id BIGINT;
  DECLARE id_found INT DEFAULT 1;

  WHILE id_found = 1 DO
    SET new_id = FLOOR(RAND() * 89999) + 10000; 
    SELECT COUNT(*) INTO id_found FROM users WHERE user_id = new_id;
  END WHILE;

  SET NEW.user_id = new_id;
END;