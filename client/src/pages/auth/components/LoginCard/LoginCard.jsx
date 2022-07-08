// client/src/pages/auth/components/LoginCard/LoginCard.jsx
import style from './style.module.css'
import image from '../assets/login-green.png'
import LoginForm from '../LoginForm/LoginForm'
import { useEffect } from 'react'

const LoginCard = () => {
  useEffect(() => {
    document.title = 'Bytetools | Login'
    return () => document.title = 'Bytetools'
  },[])

  return (
    <section className={style.LoginCard}>
      <div className={style.showcase}>
        <img src={image} className={style.img} alt=''/>
        <h1 className={style.welcomeText}>Welcome Back!</h1>
      </div>
      <LoginForm/>
    </section>
  )
}

export default LoginCard