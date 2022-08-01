import style from './style.module.css'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AuthContainer = () => {
  const { user, loggedIn, token } = useSelector(state => state.auth)
  if(user && loggedIn && token){
    return(
      <Navigate to='/' replace/>
    )
  }
  return (
    <main className={style.authContainer}>
      <Outlet/>
    </main>
  )
}

export default AuthContainer