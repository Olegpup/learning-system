import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

export async function getGroups() {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/groups`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function getGroupInfo(group_id) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/groups/${group_id}`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
    })
    return response.data
  } catch (e) {
    return null
  }
}

export async function createGroup(title) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      window.location = '/'
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/groups/create`,
      {
        title,
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

export async function deleteGroup(groupId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/groups/${groupId}/delete`,
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

export async function createStudent(groupId, firstName, secondName, fatherName) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }

    const requestData = {
      first_name: firstName,
      second_name: secondName,
      father_name: fatherName,
    }

    const response = await axios.post(`${API_BASE_URL}/api/groups/${groupId}/create-student`, requestData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    })

    return response.data
  } catch (e) {
    return null
  }
}

export async function deleteStudent(groupId, userId) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.post(
      `${API_BASE_URL}/api/groups/${groupId}/delete-student`,
      { user_id: userId },
      {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      }
    )
    return response.data
  } catch (e) {
    return null
  }
}

export async function updateGroup(groupId, title) {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/groups/${groupId}/update`,
      {
        title,
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

export async function getUserGroup() {
  try {
    const token = localStorage.getItem('session')
    if (!token) {
      return null
    }
    const response = await axios.get(`${API_BASE_URL}/api/group-info/`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
    })
    return response.data
  } catch (e) {
    return null
  }
}
