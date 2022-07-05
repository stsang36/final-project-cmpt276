import style from './style.module.css'
import { Link } from 'react-router-dom'

const RegisterCard = () => {
  return (
        <h6 className = {style.register}>
          New to Bytetools?&nbsp;&nbsp;
          <Link to="/auth/register">Create account</Link>
          </h6>
  )
}

export default RegisterCard