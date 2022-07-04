import style from './style.module.css'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
        <h6 className = {style.register}>
          New to Btyetools?&nbsp;&nbsp;
          <Link to="../Register/index.js">Create account</Link>
          </h6>
  )
}

export default Register