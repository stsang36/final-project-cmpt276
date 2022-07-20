// client/src/pages/auth/components/RegisterCard/RegisterCard.jsx
import style from './style.module.css'
import image from '../assets/register.png'
import RegisterForm from '../RegisterForm'
import { useEffect } from 'react'

const RegisterCard = () => {
  useEffect(() => {
    document.title = 'Bytetools | Register'
    return () => document.title = 'Bytetools'
  },[])

  return (
    <section className={style.registerCard}>
      <div className={style.showcase}> 
        <img src={image} className={style.img} alt='' />
        <h1 className={style.registerText}>Get Started</h1>
      </div>
      
      <RegisterForm/>
    </section>
  )
}

export default RegisterCard