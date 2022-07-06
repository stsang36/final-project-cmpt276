import Protect from 'common/components/Protect'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from 'redux/slices/authSlice'
import { toast } from 'react-toastify'

const HomeContainer = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login')
    toast.success('logged out')
  }

  return (
    <Protect>
      <div>
        <div>protected route</div>
        {user &&
          <>
            <div>
              Logged in as {user.username}
            </div>
            <button onClick={handleLogout}>Log out</button>
          </> 
        }
        {/* <div>Logged In as {user.username}</div>
        <button onClick={handleClick}>Log Out</button> */}
      </div>
    </Protect>
  )
}

export default HomeContainer