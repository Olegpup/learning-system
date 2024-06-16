import express from 'express'
import bcrypt from 'bcrypt'

import { pool } from '../../bd/db.js'
import { generateToken } from '../../utils/index.js'
import { saltRounds } from '../../../config.js'

const authRouter = express.Router()

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (rows.length > 0) {
      const user = rows[0]
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const token = generateToken(user)
        res.json({ token })
      } else {
        res.status(401).send('Authentication failed.')
      }
    } else {
      res.status(401).send('User not found.')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error during the authentication.' })
  }
})

authRouter.post('/register', async (req, res) => {
  const { first_name, second_name, father_name, email, password } = req.body
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      await pool.query(
        `INSERT INTO users (first_name, last_name, father_name, email, password, role)
        VALUES (?, ?, ?, ?, ?, 'teacher')`,
        [first_name, second_name, father_name, email, hashedPassword]
      )

      const [newUserRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])

      if (newUserRows.length > 0) {
        const token = generateToken(newUserRows[0])
        res.json({ token })
      } else {
        res.status(401).send('Register failed.')
      }
    } else {
      res.status(401).json({ error: 'User already registered' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error during the register.' })
  }
})

authRouter.get('/userinfo', async (req, res) => {
  if (req.user) {
    return res.json({
      userId: req.user.userId,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      fatherName: req.user.fatherName,
      email: req.user.email,
      role: req.user.role,
    })
  } else {
    return res.json({
      userId: req.user.userId,
    })
  }
})

authRouter.put('/update/:id', async (req, res) => {
  const userId = req.params.id;
  const { first_name, second_name, father_name, email } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      await pool.query(
        'UPDATE users SET first_name = ?, last_name = ?, father_name = ?, email = ? WHERE user_id = ?',
        [first_name, second_name, father_name, email, userId]
      );
      const [updatedRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
      const updatedUser = updatedRows[0];

      const newToken = generateToken(updatedUser);

      res.status(200).json({ token: newToken, message: 'User information updated successfully.' });
    } else {
      res.status(404).send('User not found.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during the update process.' });
  }
});

authRouter.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId; 
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(oldPassword, user.password);

      if (match) {
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        await pool.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedNewPassword, userId]);
        res.status(200).send('Password changed successfully.');
      } else {
        res.status(400).send('Old password is incorrect.');
      }
    } else {
      res.status(404).send('User not found.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during the password change process.' });
  }
});


export default authRouter
