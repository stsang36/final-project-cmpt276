// client/src/pages/auth/components/RegisterCard/RegisterCard.jsx
import style from './style.module.css'
import image from '../assets/stub-image.png'
import RegisterForm from '../RegisterForm'
import { useEffect } from 'react'

const RegisterCard = () => {
  useEffect(() => {
    document.title = 'Bytetools | Register Account'
    return () => document.title = 'Bytetools'
  },[])

  return (
    <section className={style.registerCard}>
      <img src={image} className={style.img} alt="" />
      <RegisterForm/>
    </section>
  )
}

export default RegisterCard