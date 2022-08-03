import { Routes, Route, useLocation } from 'react-router-dom'
import AuthContainer  from 'pages/auth/components/AuthContainer'
import LoginCard from 'pages/auth/components/LoginCard'
import RegisterCard from 'pages/auth/components/RegisterCard'
import RecoverCard from 'pages/auth/components/RecoverCard'
import HomeContainer from 'pages/dashboard/components/DashboardContainer'
import PasswordResetCard from 'pages/auth/components/PasswordResetCard'
import CreateContainer from 'pages/create/components/CreateContainer'
import JobModal from 'pages/job/components/JobModal'
import Layout from 'common/components/Layout'
import AdminContainer from 'pages/admin/components/AdminContainer'
import JobContainer from 'pages/job/components/JobContainer'
import { AnimatePresence } from 'framer-motion'
import SettingsContainer from 'pages/settings/SettingsContainer'
import MyJobsContainer from 'pages/myJobs/components/MyJobsContainer'
import UpdateJobModal from 'pages/job/components/UpdateJobModal'
import RootPage from 'pages/RootPage'
import PastJobs from 'pages/pastJobs/components/PastJobsContainer'
import PastJobsContainer from 'pages/pastJobs/components/PastJobsContainer'

const RoutesManager = () => {
  const location = useLocation()
  let background = location.state && location.state.backgroundLocation

  return (
    <>
      <Routes location={background || location}>
        <Route element={<Layout />}>
          <Route path='/' element={<RootPage />}/>
          <Route path='dashboard' element={<HomeContainer />}/>
          <Route path='create' element={<CreateContainer />}/>
          <Route path='viewjob/:id' element={<JobContainer />}/>
          <Route path='admin' element={<AdminContainer />}/>
          <Route path='settings' element={<SettingsContainer/>}/>
          <Route path='myjobs' element={<MyJobsContainer />} />
          <Route path='pastjobs' element={<PastJobsContainer />}/>
        </Route>
        <Route path="auth" element={<AuthContainer />}>
          <Route path='login' element={<LoginCard />} />
          <Route path='register' element={<RegisterCard />} />
          <Route path='recover' element={<RecoverCard />} />
          <Route path='passwordreset/:token' element={<PasswordResetCard />}/>
        </Route>
        {/* page not found */}
        <Route path="*"/> 
      </Routes>

      {/* Open a job modal */}
      <AnimatePresence>
        {background && (
          <Routes location={location} key={location.pathname}>
            <Route path="/viewjob/:id" element={<JobModal />}/>
            <Route path="/updateJob/:id" element={<UpdateJobModal/>}/>
          </Routes>
        )}
      </AnimatePresence>
    </>
  )
}

export default RoutesManager