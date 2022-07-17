import Layout from 'common/components/Layout'
import style from './style.module.css'
import { Outlet } from 'react-router-dom'


const AuthContainer = () => {
  return (
    <main className={style.authContainer}>
      <Outlet/>
    </main>
  )
}

export default AuthContainer