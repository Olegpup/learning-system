import express from 'express'
import { pool } from '../../bd/db.js'

const coursesRouter = express.Router()

coursesRouter.get('/courses', async (req, res) => {
  const { role, userId } = req.user

  if (role && userId) {
    if (role === 'teacher') {
      try {
        const [rows] = await pool.query(
          `SELECT 
            c.*, 
            u.user_id AS author_id,
            u.first_name AS author_first_name,
            u.last_name AS author_last_name,
            u.father_name AS author_father_name,
            u.email AS author_email
          FROM 
            courses c
          JOIN
            users u ON c.author_id = u.user_id 
          WHERE 
            c.author_id = ?`,

          [userId]
        )
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
      try {
        const [groups] = await pool.query(
          `SELECT 
          group_id 
        FROM 
          group_students 
        WHERE 
          user_id = ?`,
          [userId]
        )
        const groupIds = groups.map((group) => group.group_id)

        const [courses] = await pool.query(
          `SELECT 
            c.*,
            g.title AS group_title,
            u.first_name AS author_first_name,
            u.last_name AS author_last_name,
            u.father_name AS author_father_name
          FROM 
            courses c
          JOIN
            group_courses gc ON gc.course_id = c.course_id
          JOIN
            groups g ON g.group_id = gc.group_id
          JOIN 
            users u ON u.user_id = c.author_id
          WHERE 
            gc.group_id IN (?)`,
          [groupIds]
        )

        if (courses.length > 0) {
          return res.status(200).send({ role: role, data: courses })
        } else {
          return res.status(200).send({ role: role, data: [] })
        }
      } catch (e) {
        res.status(500).send('Error connecting')
      }
    }
    if (role === 'admin') {
      return res.status(200).send({ role: role, data: [] })
    }
  } else {
    res.status(401).send('User not authorizated')
  }
})

coursesRouter.post('/courses/create', async (req, res) => {
  const { role, userId } = req.user
  const { title, description } = req.body

  if (role && userId) {
    if (role === 'teacher') {
      try {
        const [createRows] = await pool.query(
          `INSERT INTO courses (title, description, author_id)
                   VALUES (?, ?, ?)`,
          [title, description, userId]
        )
        const [rows] = await pool.query('SELECT * FROM courses WHERE author_id = ?', [userId])
        if (rows.length > 0) {
          return res.status(200).send({ role: role, data: rows })
        } else {
          return res.status(401).send('Error with course creating')
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      return res.status(401).send({ role: role, error: 'Studen`t cant creating courses' })
    }
  }
})

coursesRouter.post('/courses/add-group', async (req, res) => {
  const { role, userId } = req.user
  const { groupId, courseId } = req.body

  if (role && userId) {
    if (role === 'teacher') {
      try {
        const [data] = await pool.query(
          `INSERT INTO group_courses (group_id, course_id )
                   VALUES (?, ?)`,
          [groupId, courseId]
        )
        return res.status(200).send({ role: role, message: 'Group added' })
      } catch (e) {
        return res.status(401).send({ role: role, message: 'Error with group adding' })
      }
    } else {
      return res.status(401).send({ role: role, error: 'Studen`t cant adding groups' })
    }
  }
})

coursesRouter.get('/courses/:course', async (req, res) => {
  const course = req.params.course
  const { role } = req.user

  if (role) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          c.*, 
          u.user_id AS author_id,
          u.first_name AS author_first_name,
          u.last_name AS author_last_name,
          u.father_name AS author_father_name,
          u.email AS author_email
        FROM 
          courses c
        JOIN
          users u ON c.author_id = u.user_id
        WHERE 
          c.course_id = ?`,
        [course]
      )

      if (rows.length > 0) {
        const [groups] = await pool.query(
          `SELECT
             g.group_id,
             g.title AS group_title,
             u.user_id AS teacher_id,
             u.first_name AS teacher_first_name,
             u.last_name AS teacher_last_name,
             u.father_name AS teacher_father_name,
             u.email AS teacher_email
           FROM
             group_courses gc
           JOIN
             groups g ON gc.group_id = g.group_id
           JOIN
             users u ON g.teacher_id = u.user_id
           WHERE
             gc.course_id = ?`,
          [course]
        )

        const results = await Promise.all(
          groups.map(async (group) => {
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

        return res.status(200).send({ role: role, data: rows, groups: results })
      } else {
        return res.status(200).send({ role: role, data: [], groups: [] })
      }
    } catch (e) {
      res.status(500).send({ message: 'Error cconnecting', error: e })
    }
  } else {
    res.status(401).send('User not authorizated')
  }
})

coursesRouter.get('/courses/:course/available-groups', async (req, res) => {
  const courseId = req.params.course
  let role = req.user?.role

  if (role) {
    try {
      const [rows] = await pool.query(
        `SELECT 
           g.group_id, 
           g.title AS group_title,
           u.user_id AS teacher_id, 
           u.first_name AS teacher_first_name, 
           u.last_name AS teacher_last_name, 
           u.father_name AS teacher_father_name,
           u.email AS teacher_email
         FROM 
           groups g
         LEFT JOIN 
           group_courses gc ON g.group_id = gc.group_id AND gc.course_id = ?
         JOIN 
           users u ON g.teacher_id = u.user_id
         WHERE 
           gc.group_id IS NULL`,
        [courseId]
      )

      if (rows.length > 0) {
        return res.status(200).send({ role, data: rows })
      } else {
        return res.status(200).send({ role, data: [] })
      }
    } catch (e) {
      console.error('Database error:', e)
      return res.status(500).send('Error connecting')
    }
  } else {
    return res.status(401).send('User not authorized')
  }
})

coursesRouter.post('/courses/:course/delete-group', async (req, res) => {
  const courseId = req.params.course
  const groupId = req.body.groupId
  let role = req.user?.role

  if (role) {
    try {
      const [rows] = await pool.query(
        `DELETE  
         FROM 
           group_courses
         WHERE 
           group_id = ? AND  course_id = ?`,
        [groupId, courseId]
      )

      if (rows.length > 0) {
        return res.status(200).send({ role, message: 'Group successful deleted' })
      } else {
        return res.status(200).send({ role, message: 'Group didn`t found ' })
      }
    } catch (e) {
      console.error('Database error:', e)
      return res.status(500).send({ role, message: 'Error connecting' })
    }
  } else {
    return res.status(401).send({ role, message: 'User not authorized' })
  }
})

coursesRouter.post('/courses/:course/delete', async (req, res) => {
  const courseId = req.params.course
  const { role, userId } = req.user || {}

  if (role) {
    try {
      const [result] = await pool.query(
        `DELETE 
         FROM 
           courses
         WHERE 
           course_id = ? AND author_id = ?`,
        [courseId, userId]
      )

      if (result.affectedRows > 0) {
        return res.status(200).send({ role, message: 'Course successfully deleted' })
      } else {
        return res.status(404).send({ role, message: 'Course not found or not authorized to delete' })
      }
    } catch (e) {
      console.error('Database error:', e)
      return res.status(500).send({ role, message: 'Error connecting', error: e })
    }
  } else {
    return res.status(401).send({ role, message: 'User not authorized' })
  }
})

export default coursesRouter
