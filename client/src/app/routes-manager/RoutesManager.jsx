import { Routes, Route } from 'react-router-dom'
import AuthContainer  from 'pages/auth/components/AuthContainer'
import LoginCard from 'pages/auth/components/LoginCard'
import RegisterCard from 'pages/auth/components/RegisterCard'
import RecoverCard from 'pages/auth/components/RecoverCard'
import HomeContainer from 'pages/home/components/HomeContainer'
import PasswordResetCard from 'pages/auth/components/PasswordResetCard'
import CreateContainer from 'pages/create/components/CreateContainer'

const RoutesManager = () => {
  return (
    <Routes>
      <Route path='/' element={<HomeContainer />}/>
      <Route path='/create' element={<CreateContainer />} />
      <Route path="auth" element={<AuthContainer />}>
        <Route path='login' element={<LoginCard />} />
        <Route path='register' element={<RegisterCard />} />
        <Route path='recover' element={<RecoverCard />} />
        <Route path='passwordreset/:token' element={<PasswordResetCard/>}/>
      </Route>
    </Routes>
  )
}

export default RoutesManager