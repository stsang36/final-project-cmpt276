import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Protect = ({roles, children}) => {
  const navigate = useNavigate()
  const { user, loggedIn, token } = useSelector(state => state.auth)

  useEffect(()=>{
    if(!loggedIn || !user || !token){
      navigate('/auth/login')
    }
    if(roles && !(roles.includes(user.role))){
      navigate('/')
    }
  },[user, loggedIn, token])

  return (
    <>
      {children}
    </>
  )
}

export default Protect