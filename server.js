import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'

import authRouter from './server/routes/users/authRouter.js'
import coursesRouter from './server/routes/courses/coursesRouter.js'
import groupsRouter from './server/routes/groups/groupsRouter.js'
import taskRouter from './server/routes/tasks/tasksRouter.js'

import { initTables } from './server/bd/init_db.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const port = 3001

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use('/server/uploads', express.static(path.join(__dirname, 'server', 'uploads')))
app.use(express.static(path.join(__dirname, 'client', 'build')))

// Middleware для перевірки JWT-токена
app.use((req, res, next) => {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]

  if (token) {
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token.' })
      } else {
        req.user = decoded
        next()
      }
    })
  } else {
    next()
  }
})

app.use('/api', authRouter)
app.use('/api', coursesRouter)
app.use('/api', groupsRouter)
app.use('/api', taskRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`)
  await initTables()
})
