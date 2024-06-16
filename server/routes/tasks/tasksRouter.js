import express from 'express'
import multer from 'multer'
import path from 'path'
import { pool } from '../../bd/db.js'
import { createSubgroups } from '../../utils/createSubgroups.js'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

const taskRouter = express.Router()

taskRouter.post('/courses/:courseId/:groupId/tasks', upload.array('files'), async (req, res) => {
  const { courseId, groupId } = req.params
  const { title, description, endDate } = req.body
  const subgroupsCount = req.body?.countSubgroups ? req.body.countSubgroups : 0
  const files = req.files

  try {
    const [taskResult] = await pool.query(
      `INSERT INTO tasks (course_id, title, description, end_date, task_type, group_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        courseId,
        title,
        description,
        endDate ? new Date(endDate) : null,
        subgroupsCount > 0 ? 'group' : 'individual',
        groupId,
      ]
    )

    const taskId = taskResult.insertId
    if (files) {
      const fileInserts = files.map((file) => {
        return pool.query(
          `INSERT INTO tasks_files (task_id, caption, file_path)
           VALUES (?, ?, ?)`,
          [taskId, file.originalname, file.path]
        )
      })
      await Promise.all(fileInserts)
    }

    if (subgroupsCount > 0) {
      const [rates] = await pool.query(
        `SELECT 
          gs.user_id AS studentId,
          GROUP_CONCAT(DISTINCT IF(t.task_type = 'group' AND ss.subgroup_id = s.subgroup_id, ct_leader.rate, ct.rate) ORDER BY ct.sended_date DESC) AS grades
        FROM 
          group_students gs
        JOIN 
          users u ON gs.user_id = u.user_id AND u.role = 'student'
        LEFT JOIN 
          group_courses gc ON gc.group_id = gs.group_id
        LEFT JOIN 
          tasks t ON t.course_id = gc.course_id
        LEFT JOIN 
          completed_tasks ct ON ct.task_id = t.task_id AND ct.user_id = gs.user_id
        LEFT JOIN 
          subgroups s ON s.task_id = t.task_id
        LEFT JOIN 
          subgroup_students ss ON s.subgroup_id = ss.subgroup_id AND ss.user_id = gs.user_id
        LEFT JOIN 
          completed_tasks ct_leader ON ct_leader.task_id = t.task_id AND ct_leader.user_id = s.leader_id
        WHERE 
          gc.course_id = ? AND gc.group_id = ?
        GROUP BY 
          gs.user_id;`,
        [courseId, groupId]
      )

      rates.forEach((row) => {
        row.grades = row.grades ? JSON.parse('[' + row.grades + ']') : []
      })

      const subgroups = createSubgroups(rates, subgroupsCount, 1, 100)
      subgroups.map(async (group) => {
        const leaderId = group[Math.floor(Math.random() * group.length)]

        const [subgroupResult] = await pool.query(`INSERT INTO subgroups (task_id, leader_id) VALUES (?,?)`, [
          taskId,
          leaderId,
        ])
        const subgroupId = subgroupResult.insertId
        group.forEach(async (student) => {
          const [response] = await pool.query(`INSERT INTO subgroup_students (subgroup_id, user_id) VALUES (?, ?)`, [
            subgroupId,
            student,
          ])
        })
      })
    }
    res.status(201).send({ message: 'Task and files uploaded successfully' })
  } catch (error) {
    console.error('Failed to insert task and files:', error)
    res.status(500).send({ message: 'Error adding task and files' })
  }
})

taskRouter.get('/courses/:courseId/tasks', async (req, res) => {
  const { courseId } = req.params
  const { userId, role } = req.user
  const baseURL = `${req.protocol}://${req.get('host')}/`

  try {
    let tasks
    if (role == 'student') {
      ;[tasks] = await pool.query(
        `SELECT DISTINCT
          t.task_id,
          t.title,
          t.description,
          t.publish_date,
          t.end_date,
          t.task_type,
          IF(t.task_type = 'group',
             EXISTS(SELECT 1 FROM completed_tasks ct_leader WHERE ct_leader.user_id = sg.leader_id AND ct_leader.task_id = t.task_id),
             ct.sended_date IS NOT NULL
          ) AS is_completed
        FROM
          tasks t
        LEFT JOIN
          subgroups sg ON sg.task_id = t.task_id
        LEFT JOIN
          subgroup_students ss ON ss.subgroup_id = sg.subgroup_id AND ss.user_id = ?
        LEFT JOIN
          completed_tasks ct ON ct.user_id = ? AND ct.task_id = t.task_id
        WHERE
          t.course_id = ? AND
          (t.task_type = 'individual' OR (t.task_type = 'group' AND ss.user_id IS NOT NULL))
        ORDER BY
          t.publish_date DESC`,
        [userId, userId, courseId]
      )
    } else {
      ;[tasks] = await pool.query(
        `SELECT
          t.task_id,
          t.title,
          t.description,
          t.publish_date,
          t.end_date,
          t.task_type,
          ct.sended_date IS NOT NULL AS is_completed
        FROM
          tasks t
        LEFT JOIN
          completed_tasks ct ON ct.user_id = ? AND ct.task_id = t.task_id
        WHERE
          t.course_id = ?
        ORDER BY
           t.publish_date DESC`,
        [userId, courseId]
      )
    }

    if (tasks.length > 0) {
      await Promise.all(
        tasks.map(async (task) => {
          const [files] = await pool.query(
            `SELECT
               file_id,
               caption,
               CONCAT('${baseURL}', file_path) AS file_url
             FROM
               tasks_files
             WHERE
               task_id = ?`,
            [task.task_id]
          )
          task.files = files
        })
      )
      return res.status(200).send({ message: 'Tasks found', tasks })
    } else {
      return res.status(200).send({ message: 'No tasks found for this course', tasks: [] })
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return res.status(500).send({ message: 'Error fetching tasks' })
  }
})

taskRouter.get('/courses/:courseId/task/:taskId', async (req, res) => {
  const { courseId, taskId } = req.params
  const baseURL = `${req.protocol}://${req.get('host')}/`
  const { role, userId } = req.user

  try {
    let tasks
    if (role === 'teacher') {
      ;[tasks] = await pool.query(
        `SELECT
        t.task_id,
        t.title,
        t.description,
        t.publish_date,
        t.end_date,
        t.task_type,
        ct.sended_date IS NOT NULL AS is_completed,
        ct.sended_date AS completed_date,
        ct.rate AS completed_rate,
        ct.description AS completed_description
      FROM
        tasks t
      LEFT JOIN
        completed_tasks ct ON ct.user_id = ? AND ct.task_id = ?
      WHERE
        t.course_id = ? AND t.task_id = ?`,
        [userId, taskId, courseId, taskId]
      )
    } else {
      ;[tasks] = await pool.query(
        `SELECT
        t.task_id,
        t.title,
        t.description,
        t.publish_date,
        t.end_date,
        t.task_type,
        IF(t.task_type = 'group', ct_leader.sended_date, ct.sended_date) AS completed_date,
        IF(t.task_type = 'group', ct_leader.rate, ct.rate) AS completed_rate,
        IF(t.task_type = 'group', ct_leader.description, ct.description) AS completed_description,
        (IF(t.task_type = 'group', ct_leader.sended_date, ct.sended_date) IS NOT NULL) AS is_completed
      FROM
        tasks t
      LEFT JOIN
        subgroups sg ON sg.task_id = t.task_id
      LEFT JOIN
        subgroup_students ss ON ss.subgroup_id = sg.subgroup_id AND ss.user_id = ?
      LEFT JOIN
        completed_tasks ct ON ct.task_id = t.task_id AND ct.user_id = ?
      LEFT JOIN
        completed_tasks ct_leader ON ct_leader.task_id = t.task_id AND ct_leader.user_id = sg.leader_id
      WHERE
        t.course_id = ? AND t.task_id = ? AND (t.task_type = 'individual' OR (t.task_type = 'group' AND ss.user_id IS NOT NULL))`,
        [userId, userId, courseId, taskId]
      )
    }
    if (tasks.length > 0) {
      await Promise.all(
        tasks.map(async (task) => {
          const [files] = await pool.query(
            `SELECT
              file_id,
              caption,
              CONCAT('${baseURL}', file_path) AS file_url
            FROM
              tasks_files
            WHERE
              task_id = ?`,
            [task.task_id]
          )
          task.files = files

          if (task.task_type === 'group') {
            const [subgroups] = await pool.query(
              `SELECT
                s.subgroup_id,
                s.leader_id,
                u.first_name AS leader_first_name,
                u.last_name AS leader_last_name,
                u.father_name AS leader_father_name,
                GROUP_CONCAT(CONCAT(uu.user_id, ':', uu.first_name, ' ', uu.last_name, ' ', uu.father_name) SEPARATOR ';') AS members_details
              FROM
                subgroups s
              JOIN
                subgroup_students ss ON s.subgroup_id = ss.subgroup_id
              JOIN
                users u ON u.user_id = s.leader_id
              JOIN
                users uu ON uu.user_id = ss.user_id
              WHERE
                s.task_id = ?
              GROUP BY
                s.subgroup_id`,
              [task.task_id]
            )
            task.subgroups = subgroups.map((subgroup) => {
              return {
                ...subgroup,
                members_details: subgroup.members_details.split(';').map((member) => {
                  let [id, fullName] = member.split(':')
                  id = Number(id)
                  return { id, fullName }
                }),
              }
            })
          }
        })
      )
      return res.status(200).send({ userId: userId, role: role, message: 'Tasks found', tasks })
    } else {
      return res.status(404).send({ userId: userId, role: role, message: 'No tasks found for this course', tasks: [] })
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return res.status(500).send({ message: 'Error fetching tasks' })
  }
})

taskRouter.post('/courses/:courseId/delete-task', async (req, res) => {
  const groupId = req.params.group
  const { role, userId } = req.user || {}
  const { taskId } = req.body

  if (role) {
    try {
      const [result] = await pool.query(
        `DELETE 
           FROM 
             tasks
           WHERE 
             task_id = ?`,
        [taskId]
      )

      if (result.affectedRows > 0) {
        return res.status(200).send({ role, message: 'Task successfully deleted' })
      } else {
        return res.status(404).send({ role, message: 'Taskp not found or not authorized to delete' })
      }
    } catch (e) {
      console.error('Database error:', e)
      return res.status(500).send({ role, message: 'Error connecting', error: e })
    }
  } else {
    return res.status(401).send({ role, message: 'User not authorized' })
  }
})

// Надіслати виконане завдання
taskRouter.post('/courses/:courseId/task/:taskId/submit', upload.array('files'), async (req, res) => {
  const { taskId } = req.params
  const { description } = req.body
  const { userId } = req.user
  const files = req.files

  try {
    const [taskResult] = await pool.query(
      `INSERT INTO completed_tasks (user_id, task_id, rate, description)
         VALUES (?, ?, ?, ?)`,
      [userId, taskId, 0, description]
    )

    const insertedTaskId = taskResult.insertId
    if (files) {
      const fileInserts = files.map((file) => {
        return pool.query(
          `INSERT INTO completed_task_files (complete_task_id, caption, file_path)
             VALUES (?, ?, ?)`,
          [insertedTaskId, file.originalname, file.path]
        )
      })
      await Promise.all(fileInserts)
    }

    res.status(201).send({ message: 'Task and files uploaded successfully' })
  } catch (error) {
    console.error('Failed to insert task and files:', error)
    res.status(500).send({ message: 'Error adding task and files' })
  }
})

// Оцінки
taskRouter.get('/:userid/grades', async (req, res) => {
  const { userid } = req.params
  const baseURL = `${req.protocol}://${req.get('host')}/`

  try {
    const [lines] = await pool.query(
      `SELECT
      ct.complete_task_id,
      ct.task_id,
      ct.user_id,
      ct.description,
      ct.rate,
      ct.sended_date,
      t.course_id,
      t.title AS task_title,
      t.description AS task_description
    FROM 
      completed_tasks ct
    JOIN 
      tasks t ON t.task_id = ct.task_id
    WHERE 
      user_id = ?
    GROUP BY
      t.course_id`,
      [userid]
    )

    if (lines.length > 0) {
      await Promise.all(
        lines.map(async (task) => {
          const [files] = await pool.query(
            `SELECT
              file_id,
              caption,
              CONCAT('${baseURL}', file_path) AS file_url
            FROM
              completed_task_files
            WHERE
              complete_task_id = ?`,
            [task.complete_task_id]
          )
          task.files = files
        })
      )
      res.status(200).send(lines)
    } else {
      res.status(500).send({ message: 'Tasks don`t found' })
    }
  } catch (e) {
    res.status(500).send({ message: 'Error with database' })
  }
})

taskRouter.get('/courses/:courseId/submited-tasks', async (req, res) => {
  const { courseId } = req.params

  try {
    const [tasks] = await pool.query(
      `
    SELECT
      ct.complete_task_id,
      ct.rate,
      ct.description AS task_comment,
      ct.sended_date,
      ct.rate IS NOT NULL AS is_rated,
      u.first_name AS student_first_name,
      u.last_name AS student_last_name,
      u.father_name AS student_father_name,
      ct.task_id,
      t.title AS task_title,
      t.description AS task_description
    FROM
      completed_tasks ct
    JOIN
      tasks t ON t.task_id = ct.task_id
    JOIN
      users u ON u.user_id = ct.user_id
    WHERE
      t.course_id = ?
    ORDER BY
      ct.sended_date DESC`,
      [courseId]
    )
    res.status(200).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: 'Error connecting with database' })
  }
})

taskRouter.get('/courses/:courseId/submited-tasks/:taskId', async (req, res) => {
  const { courseId, taskId } = req.params
  const baseURL = `${req.protocol}://${req.get('host')}/`
  const { role } = req.user

  try {
    const [tasks] = await pool.query(
      `
    SELECT
      ct.complete_task_id,
      ct.rate,
      ct.description AS task_comment,
      u.first_name AS student_first_name,
      u.last_name AS student_last_name,
      u.father_name AS student_father_name,
      u.user_id AS student_user_id, 
      ct.task_id,
      t.title AS task_title,
      t.description AS task_description,
      t.task_type
    FROM
      completed_tasks ct
    JOIN
      tasks t ON t.task_id = ct.task_id
    JOIN
      users u ON u.user_id = ct.user_id
    WHERE
      t.course_id = ? AND ct.complete_task_id = ?
    `,
      [courseId, taskId]
    )
    if (tasks.length > 0) {
      await Promise.all(
        tasks.map(async (item) => {
          const [files] = await pool.query(
            `SELECT CONCAT('${baseURL}', file_path) AS file_url, caption  FROM completed_task_files WHERE complete_task_id = ?`,
            [item.complete_task_id]
          )
          item.files = files
        })
      )
      res.status(200).send({ role: role, tasks: tasks })
    } else {
      res.status(500).send({ role: role, tasks: [] })
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: 'Error connecting with database' })
  }
})

taskRouter.get('/courses/:courseId/rates/:groupId', async (req, res) => {
  const { courseId, groupId } = req.params

  try {
    const [rates] = await pool.query(
      `SELECT 
        gs.user_id AS studentId,
        GROUP_CONCAT(DISTINCT IF(t.task_type = 'group' AND ss.subgroup_id = s.subgroup_id, ct_leader.rate, ct.rate) ORDER BY ct.sended_date DESC) AS grades
      FROM 
        group_students gs
      JOIN 
        users u ON gs.user_id = u.user_id AND u.role = 'student'
      LEFT JOIN 
        group_courses gc ON gc.group_id = gs.group_id
      LEFT JOIN 
        tasks t ON t.course_id = gc.course_id
      LEFT JOIN 
        completed_tasks ct ON ct.task_id = t.task_id AND ct.user_id = gs.user_id
      LEFT JOIN 
        subgroups s ON s.task_id = t.task_id
      LEFT JOIN 
        subgroup_students ss ON s.subgroup_id = ss.subgroup_id AND ss.user_id = gs.user_id
      LEFT JOIN 
        completed_tasks ct_leader ON ct_leader.task_id = t.task_id AND ct_leader.user_id = s.leader_id
      WHERE 
        gc.course_id = ? AND gc.group_id = ?
      GROUP BY 
        gs.user_id;`,
      [courseId, groupId]
    )
    console.log(rates)
    rates.forEach((row) => {
      row.grades = row.grades ? JSON.parse('[' + row.grades + ']') : []
    })
    const subgroups = createSubgroups(rates, 4, 1, 100)
    subgroups.map((group, index) => {
      console.log(`Group ${index + 1}`)
      const leader = group[Math.floor(Math.random() * group.length)]
      console.log(`Leader of Group ${index + 1}: ${leader}`)
      group.forEach((student) => {
        console.log(student)
      })
    })
    res.status(200).send(rates)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error with db connecting')
  }
})

taskRouter.post('/courses/:courseId/submited-tasks/:taskId/grade', async (req, res) => {
  const { taskId } = req.params
  const { grade, submitedUserId } = req.body

  try {
    const [response] = await pool.query(
      `UPDATE completed_tasks SET rate = ? WHERE complete_task_id = ? AND user_id = ?`,
      [grade, taskId, submitedUserId]
    )
    res.status(200).send({ message: 'Succes' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: 'Error connecting with database' })
  }
})
export default taskRouter
