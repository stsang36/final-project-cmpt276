import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const Protect = ({roles = ['transcriber', 'reviewer', 'admin'], children}) => {
  const { user, loggedIn, token } = useSelector(state => state.auth)

  if(loggedIn && token && user && roles.includes(user.role)){
    return (
      <>
        {children}
      </>
    )
  }
  return(
    <Navigate to='/auth/login' replace/>
  )
}

export default Protect