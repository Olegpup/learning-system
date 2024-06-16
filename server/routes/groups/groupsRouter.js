import express from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../../bd/db.js'
import { transliterate, sanitize } from '../../utils/index.js'
import { saltRounds } from '../../../config.js'

const groupsRouter = express.Router()

// Отримання груп конкретного викладача
groupsRouter.get('/groups', async (req, res) => {
  let role
  let userId
  if (req.user) {
    role = req.user.role
    userId = req.user.userId
  }

  if (role && userId) {
    if (role === 'teacher') {
      try {
        const [rows] = await pool.query('SELECT * FROM groups WHERE teacher_id = ?', [userId])

        if (rows.length > 0) {
          return res.status(200).send({ role: role, data: rows })
        } else {
          return res.status(200).send({ role: role, data: rows })
        }
      } catch (e) {
        res.status(500).send('Error cconnecting')
      }
    }
    if (role === 'student') {
      return res.status(200).send({ role: role, data: [] })
    }
    if (role === 'admin') {
      return res.status(200).send({ role: role, data: [] })
    }
  } else {
    res.status(401).send('User not authorizated')
  }
})

// Отримання інформації про групу
groupsRouter.get('/groups/:group', async (req, res) => {
  const groupId = req.params.group
  const { role } = req.user || {}

  if (role) {
    try {
      const [groupRows] = await pool.query(
        `SELECT
           g.*,
           u.user_id AS teacher_id,
           u.first_name AS teacher_first_name,
           u.last_name AS teacher_last_name,
           u.father_name AS teacher_father_name,
           u.email AS teacher_email
         FROM
           groups g
         JOIN
           users u ON g.teacher_id = u.user_id
         WHERE
           g.group_id = ?`,
        [groupId]
      )

      if (groupRows.length === 0) {
        return res.status(401).send('Group not found')
      }

      const [users] = await pool.query(
        `SELECT
           u.user_id,
           u.first_name,
           u.last_name,
           u.father_name,
           u.email,
           u.role,
           u.registration_date
         FROM
           group_students gs
         JOIN
           users u ON gs.user_id = u.user_id
         WHERE
           gs.group_id = ?`,
        [groupId]
      )

      const [courses] = await pool.query(
        `SELECT
           c.course_id,
           c.title,
           c.description,
           c.author_id,
           u.first_name AS author_first_name,
           u.last_name AS author_last_name,
           u.father_name AS author_father_name,
           u.email AS author_email
         FROM
           group_courses gc
         JOIN
           courses c ON gc.course_id = c.course_id
         JOIN
           users u ON c.author_id = u.user_id
         WHERE
           gc.group_id = ?`,
        [groupId]
      )

      return res.status(200).send({
        role,
        data: groupRows,
        users,
        courses,
      })
    } catch (e) {
      console.error('Database error:', e)
      return res.status(500).send('Error connecting')
    }
  } else {
    return res.status(401).send('User not authorized')
  }
})

// Додавання студенту в группу. При доаванні студента використовуєтсья транслітеризація та автоматична генерація пошти + пароль
groupsRouter.post('/groups/:group/create-student', async (req, res) => {
  const group = req.params.group
  let { first_name, second_name, father_name } = req.body

  first_name = sanitize(first_name)
  second_name = sanitize(second_name)
  father_name = sanitize(father_name)

  const emailBase = `${transliterate(first_name)}_${transliterate(second_name)}@studentboard.com.ua`.toLowerCase()
  const password = Math.random().toString(36).slice(-8)

  try {
    await pool.query(
      `INSERT INTO users (first_name, last_name, father_name, email, password, role)
      VALUES (?, ?, ?, ?, ?, 'student')`,
      [first_name, second_name, father_name, emailBase, await bcrypt.hash(password, saltRounds)]
    )

    const [insertUserResult] = await pool.query(
      `SELECT * 
      FROM users 
      WHERE email = ?`,
      [emailBase]
    )

    const userId = insertUserResult[0].user_id
    const pwd = await bcrypt.hash(`temporary_pwd_${userId}`, saltRounds)

    const emailParts = emailBase.split('@')
    const uniqueEmail = `${emailParts[0]}_${userId}@${emailParts[1]}`
    await pool.query('UPDATE users SET email = ?, password = ? WHERE user_id = ?', [uniqueEmail, pwd, userId])

    await pool.query(
      `INSERT INTO group_students (group_id, user_id)
      VALUES (?, ?)`,
      [group, userId]
    )

    res.json({ message: 'Student registered and added to group successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error during student registration' })
  }
})

// Видалення студента
groupsRouter.post('/groups/:group/delete-student', async (req, res) => {
  const group = req.params.group
  const { user_id } = req.body

  try {
    const [delteUser] = await pool.query(`DELETE FROM users WHERE user_id = ?`, [user_id])

    const [deleteUserFromGroups] = await pool.query(`DELETE FROM group_students WHERE user_id = ?`, [user_id])

    res.json({ message: 'Student successfully deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error during student registration' })
  }
})

// Створення группи
groupsRouter.post('/groups/create', async (req, res) => {
  let role
  let userId
  if (req.user) {
    role = req.user.role
    userId = req.user.userId
  }

  const { title } = req.body

  if (role && userId) {
    if (role === 'teacher') {
      try {
        const [createRows] = await pool.query(
          `INSERT INTO groups (title, teacher_id)
                   VALUES (?, ?)`,
          [title, userId]
        )
        const [rows] = await pool.query('SELECT * FROM groups WHERE teacher_id = ?', [userId])
        if (rows.length > 0) {
          return res.status(200).send({ role: role, data: rows })
        } else {
          return res.status(401).send('Error with group creating')
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      return res.status(401).send({ role: role, error: 'Studen`t cant creating groups' })
    }
  }
})

// Видалення группи
groupsRouter.post('/groups/:group/delete', async (req, res) => {
  const groupId = req.params.group
  const { role, userId } = req.user || {}

  if (role) {
    try {
      const [result] = await pool.query(
        `DELETE 
         FROM 
           groups
         WHERE 
           group_id = ? AND teacher_id = ?`,
        [groupId, userId]
      )

      if (result.affectedRows > 0) {
        return res.status(200).send({ role, message: 'Group successfully deleted' })
      } else {
        return res.status(404).send({ role, message: 'Group not found or not authorized to delete' })
      }
    } catch (e) {
      console.error('Database error:', e)
      return res.status(500).send({ role, message: 'Error connecting', error: e })
    }
  } else {
    return res.status(401).send({ role, message: 'User not authorized' })
  }
})

// Оновлення інформації про группу
groupsRouter.put('/groups/:groupId/update', async (req, res) => {
  const groupId = req.params.groupId
  const { title } = req.body

  try {
    const [rows] = await pool.query('SELECT * FROM groups WHERE group_id = ?', [groupId])
    if (rows.length > 0) {
      await pool.query('UPDATE groups SET title = ? WHERE group_id = ?', [title, groupId])

      res.status(200).json({ message: 'Group information updated successfully.' })
    } else {
      res.status(404).send('Group not found.')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error during the update process.' })
  }
})

// Отримання інформації про группу студента
groupsRouter.get('/group-info', async (req, res) => {
  const { userId, role } = req.user

  try {
    const [userGroups] = await pool.query(
      `SELECT 
        g.group_id,
        g.title AS group_title,
        g.teacher_id,
        u.first_name AS teacher_first_name,
        u.last_name AS teacher_last_name,
        u.father_name AS teacher_father_name
      FROM 
        groups g
      JOIN 
        group_students gs ON gs.group_id = g.group_id
      JOIN 
        users u ON u.user_id = g.teacher_id
      WHERE 
        gs.user_id = ?`,
      [userId]
    )

    if (userGroups.length === 0) {
      return res.status(404).send('No groups found for this user')
    }

    const results = await Promise.all(
      userGroups.map(async (group) => {
        const [students] = await pool.query(
          `SELECT 
          u.user_id,
          u.first_name,
          u.last_name,
          u.father_name,
          u.email
        FROM 
          users u
        JOIN 
          group_students gs ON gs.user_id = u.user_id
        WHERE 
          gs.group_id = ?`,
          [group.group_id]
        )

        return {
          role: role,
          ...group,
          students: students,
        }
      })
    )

    res.status(200).send(results)
  } catch (e) {
    res.status(500).send('Error connecting to the database')
  }
})

export default groupsRouter
