import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

// Авторизація
export async function userLogin(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, { email, password })
    localStorage.setItem('session', JSON.stringify(response.data))
    window.location = '/'
    return response.data
  } catch (e) {
    return null
  }
}

// Реєстрація
export async function userRegister(firstName, secondName, fatherName, email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/register`, {
      first_name: firstName,
      second_name: secondName,
      father_name: fatherName,
      email,
      password,
    })
    localStorage.setItem('session', JSON.stringify(response.data))
    window.location = '/'
    return response.data
  } catch (e) {
    return null
  }
}

// Отримати інформації про користувача
export async function getUser() {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/userinfo`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
    })
    return response.data
  } catch (e) {
    return null
  }
}

// Оновити дані користувача
export async function updateUser(userId, firstName, secondName, fatherName, email) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/update/${userId}`,
      {
        first_name: firstName,
        second_name: secondName,
        father_name: fatherName,
        email,
      },
      {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      }
    )

    localStorage.setItem('session', JSON.stringify({ token: response.data.token }))
    return response.data
  } catch (e) {
    return null
  }
}

// Оновити пароль
export async function changePassword(oldPassword, newPassword) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/change-password`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      }
    )

    return response.data
  } catch (e) {
    return null
  }
}
