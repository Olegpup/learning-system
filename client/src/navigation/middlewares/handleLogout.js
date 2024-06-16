import { redirect } from 'react-router-dom'

export default function handleLogout() {
  return () => {
    sessionStorage.removeItem('session')
    return redirect('/authorization')
  }
}
