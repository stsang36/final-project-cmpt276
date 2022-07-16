import { Link } from 'react-router-dom'
import Button from '../Button'
import style from './style.module.css'
import { useDispatch } from 'react-redux'
import { logout } from 'redux/slices/authSlice'

const Sidebar = () => {
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(logout())
  }

  return (
    <nav className={style.nav}>
      <h1 className={style.h1}>
        Bytetools
      </h1>
      <ul className={style.ul}>
        <li className={style.li}>
          <Link 
            to='/'
            className={style.a}
          >
            Dashboard
          </Link>
        </li>
        <li className={style.li}>
          <Link 
            to='/create'
            className={style.a}
          >
            Create 
          </Link>
        </li>
        <li className={style.li}>
          <Link 
            to='/create'
            className={style.a}
          >
            Available Jobs
          </Link>
        </li>
        <li className={style.li}>
          <Link 
            to='/settings'
            className={style.a}
          >
            Settings
          </Link>
        </li>
      </ul>
      <Button 
        className={style.btn}
        text='Sign out'
        onClick={handleClick}
      />
    </nav>
  )
}

export default Sidebar