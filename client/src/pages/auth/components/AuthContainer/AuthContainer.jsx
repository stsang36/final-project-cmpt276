import Layout from 'common/components/Layout'
import style from './style.module.css'
import { Outlet } from 'react-router-dom'


const AuthContainer = () => {
  return (
    <Layout>
      <main className={style.authContainer}>
        <Outlet/>
      </main>
    </Layout>
  )
}

export default AuthContainer