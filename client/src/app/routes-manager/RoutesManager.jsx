import { Routes, Route } from 'react-router-dom'
import AuthContainer  from 'pages/auth/components/AuthContainer'
import LoginCard from 'pages/auth/components/LoginCard'
import RegisterCard from 'pages/auth/components/RegisterCard'
import RecoverCard from 'pages/auth/components/RecoverCard'
import HomeContainer from 'pages/dashboard/components/DashboardContainer'
import PasswordResetCard from 'pages/auth/components/PasswordResetCard'
import CreateContainer from 'pages/create/components/CreateContainer'
import JobContainer from 'pages/job/components/JobContainer'
import Layout from 'common/components/Layout'
import AdminContainer from 'pages/admin/components/AdminContainer'

const RoutesManager = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomeContainer />}/>
        <Route path='/create' element={<CreateContainer />}/>
        <Route path='/viewjob/:id' element={<JobContainer />}/>
        <Route path='/admin' element={<AdminContainer />}/>
      </Route>
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