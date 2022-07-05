import Layout from 'common/components/Layout'
import style from './style.module.css'
import { Outlet } from 'react-router-dom'


const AuthContainer = () => {
  return (
    <Layout>
      <div className={style.authContainer}>
        <Outlet/>
      </div>
    </Layout>
  )
}

export default AuthContainer