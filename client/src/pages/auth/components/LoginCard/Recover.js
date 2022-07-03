import style from './style.module.css'

import { Link } from 'react-router-dom'

const Recover = () => {
  return (
    <p className={style.recover}>
        <Link to="../Recover/index.js">Forgot Password?</Link>
    </p>
  )
}

export default Recover