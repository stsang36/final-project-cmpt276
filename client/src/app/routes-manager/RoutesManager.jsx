import { Routes, Route } from 'react-router-dom'
import AuthContainer  from 'pages/auth/components/AuthContainer'
import LoginCard from 'pages/auth/components/LoginCard/LoginCard'

const RoutesManager = () => {

  // Submit Login information
  const login = (info) =>
  {
    console.log(info)
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthContainer />}/>
      <Route path="/" element={
          <LoginCard title = 'Bytetools' onLogin ={login} />} />
    </Routes>
  )
}

export default RoutesManager