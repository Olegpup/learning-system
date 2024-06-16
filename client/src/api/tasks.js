// api/tasks.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

export async function addTask(courseId, formData, group) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }

    const response = await axios.post(`${API_BASE_URL}/api/courses/${courseId}/${group}/tasks`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function getTasks(courseId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }

    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}/tasks`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function deleteTask(courseId, taskId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/courses/${courseId}/delete-task`,
      { taskId },
      {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      }
    )
    return response.data
  } catch (e) {
    return null
  }
}

export async function getTask(courseId, taskId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }

    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function submitTask(courseId, taskId, formData) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.post(`${API_BASE_URL}/api/courses/${courseId}/task/${taskId}/submit`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function getSubmitedTasks(courseId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}/submited-tasks`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    })
    return response.data
  } catch (e) {
  }
}

export async function getSubmitedTask(courseId, taskId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}/submited-tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    })
    return response.data
  } catch (e) {
  }
}

export async function rateSubmitedTask(courseId, taskId, submitedUserId, grade) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/courses/${courseId}/submited-tasks/${taskId}/grade`,
      {
        grade: grade,
        submitedUserId: submitedUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      }
    )
    return response.data
  } catch (e) {
    return null
  }
}
