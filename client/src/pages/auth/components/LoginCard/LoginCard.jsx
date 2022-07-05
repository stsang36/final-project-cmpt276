// client/src/pages/auth/components/LoginCard/LoginCard.jsx

import style from './style.module.css'
import image from '../assets/login-green.png'
import LoginForm from '../LoginForm/LoginForm'

const LoginCard = () => {

  return (
    <div className={style.LoginCard}>
      <div className={style.showcase}>
        <img src={image} className={style.img} alt= "Welcome Image"/>
        <h1 className={style.welcomeText}>Welcome Back!</h1>
      </div>
      <LoginForm/>
    </div>
  )
}

export default LoginCard