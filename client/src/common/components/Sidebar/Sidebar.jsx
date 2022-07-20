import { Link } from 'react-router-dom'
import Button from '../Button'
import style from './style.module.css'
import { useDispatch } from 'react-redux'
import { logout } from 'redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const { user } = useSelector(state => state.auth)
  const role = user ? user.role : null
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleClick = () => {
    dispatch(logout())
    navigate('/auth/login')
  }

  if(!user){
    return (<></>)
  }
  return (
    <nav className={style.nav}>
      <h1 className={style.h1}>
        Bytetools
      </h1>
      <ul className={style.ul}>
        {(role === 'transcriber' || role === 'reviwer') &&
          <li className={style.li}>
            <Link 
              to='/'
              className={style.a}
            >
              Dashboard
            </Link>
          </li>
        }
        {role === 'admin' &&
          <li className={style.li}>
            <Link 
              to='/admin'
              className={style.a}
            >
              Admin
            </Link>
          </li>
        }
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