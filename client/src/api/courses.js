import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

export async function getCourses() {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/courses`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function getCourseInfo(course_id) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/courses/${course_id}`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function createCourse(title, description) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      window.location = '/'
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/courses/create`,
      {
        title,
        description,
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

export async function addGroupToCourse(groupId, courseId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      window.location = '/'
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/courses/add-group`,
      {
        groupId,
        courseId,
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

export async function deleteGroupFromCourse(groupId, courseId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      window.location = '/'
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/courses/${courseId}/delete-group`,
      {
        groupId,
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

export async function getGroupsAviableForAdding(courseId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}/available-groups`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function deleteCourse(courseId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/courses/${courseId}/delete`,
      {},
      {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      }
    )
    return response.data
  } catch (e) {
    return null
  }
}
