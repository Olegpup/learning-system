import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js'; 

function loadSqlQuery(file, folder) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, 'sql', folder, file);
  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

async function createTable(sqlFileName, tableName, folder) {
  const sql = loadSqlQuery(sqlFileName, folder);

  try {
    const [result] = await pool.query(sql);
    console.log(`Таблицю ${tableName} створено`);
  } catch (err) {
    console.error(`Помилка створення таблиці ${tableName}:`, err);
  }
}

export async function initTables() {
  await createTable('users.sql', 'users', 'tables');
  await createTable('users_trigger.sql', 'users_trigger', 'triggers');
  await createTable('courses.sql', 'courses', 'tables');
  await createTable('groups.sql', 'groups', 'tables');
  await createTable('group_courses.sql', 'group_courses', 'tables');
  await createTable('group_students.sql', 'group_students', 'tables');
  await createTable('tasks.sql', 'tasks', 'tables');
  await createTable('tasks_files.sql', 'tasks_files', 'tables');
  await createTable('subgroups.sql', 'subgroups', 'tables');
  await createTable('subgroup_students.sql', 'subgroup_students', 'tables');
  await createTable('completed_task.sql', 'completed_task', 'tables');
  await createTable('completed_task_files.sql', 'completed_task_files', 'tables');
}
