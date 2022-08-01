import Protect from 'common/components/Protect'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const RootPage = () => {
  const { user } = useSelector(state => state.auth)
  return (
    <Protect>
      {user && user.role === 'client' && (
        <Navigate to='/myjobs' replace/>
      )}
      {user && user.role === 'admin' && (
        <Navigate to='/admin' replace/>
      )}
      {user && (user.role === 'transcriber' || user.role === 'reviewer') && (
        <Navigate to='/dashboard' replace/>
      )}
    </Protect>
  )
}

export default RootPage