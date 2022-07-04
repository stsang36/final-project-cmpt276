import Layout from 'common/components/Layout'
import style from './style.module.css'
import { Outlet } from 'react-router-dom'


const AuthContainer = ({outlet}) => {
  return (
    <Layout title={'Authentication Page'}>
      <Outlet/>
    </Layout>
  )
}

export default AuthContainer