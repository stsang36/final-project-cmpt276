import Sidebar from '../Sidebar'
import Footer from '../Footer'
import style from './style.module.css'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className={style.layout}>
      <Sidebar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  )
}

export default Layout