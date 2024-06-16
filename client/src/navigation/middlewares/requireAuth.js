import { redirect } from 'react-router-dom'

export default function requireAuth() {
  return async ({ element }) => {
    try {
      const session = localStorage.getItem('session')
      if (!session) {
        return redirect('/authorization')
      }
      return { element }
    } catch (error) {
      return null
    }
  }
}
