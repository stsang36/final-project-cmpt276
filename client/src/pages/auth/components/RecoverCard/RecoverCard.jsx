import style from './style.module.css'
import { Link } from 'react-router-dom'

const RecoverCard = () => {
  return (
    <p className={style.recover}>
        <Link to="/auth/recover">Forgot Password?</Link>
    </p>

  )
}

export default RecoverCard