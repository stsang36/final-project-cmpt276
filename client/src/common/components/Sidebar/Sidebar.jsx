import { Link } from 'react-router-dom'
import Button from '../Button'
import style from './style.module.css'
import { useDispatch } from 'react-redux'
import { logout } from 'redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaHatWizard, FaClipboardList } from 'react-icons/fa'
import { MdCreateNewFolder } from 'react-icons/md'
import { BsGearFill } from 'react-icons/bs'
import { IoRocketSharp } from 'react-icons/io5'

const Sidebar = () => {
  const { user } = useSelector(state => state.auth)
  const role = user ? user.role : null
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleClick = () => {
    dispatch(logout())
    toast.success('Signed out')
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
              to='/dashboard'
              className={style.a}
            >
              <IoRocketSharp className={style.icon}/>
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
              <FaHatWizard className={style.icon}/>
              Admin
            </Link>
          </li>
        }
        <li className={style.li}>
          <Link
            to='/myjobs'
            className={style.a}
          >
            <FaClipboardList className={style.icon}/>
            My Jobs
          </Link>
        </li>
        <li className={style.li}>
          <Link 
            to='/create'
            className={style.a}
          >
            <MdCreateNewFolder className={style.icon}/>
            Create 
          </Link>
        </li>
        <li className={style.li}>
          <Link 
            to='/settings'
            className={style.a}
          >
            <BsGearFill className={style.icon}/>
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