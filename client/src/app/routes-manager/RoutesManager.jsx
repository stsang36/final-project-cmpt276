import { Routes, Route } from 'react-router-dom'
import AuthContainer  from 'pages/auth/components/AuthContainer'

const RoutesManager = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthContainer />}/>
    </Routes>
  )
}

export default RoutesManager