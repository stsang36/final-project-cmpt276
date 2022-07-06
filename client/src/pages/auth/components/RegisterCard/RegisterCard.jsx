// client/src/pages/auth/components/RegisterCard/RegisterCard.jsx
import style from './style.module.css'
import image from '../assets/stub-image.png'
import RegisterForm from '../RegisterForm'

const RegisterCard = () => {
  return (
    <div className={style.registerCard}>
      <img src={image} className={style.img} alt="Register Image" />
      <RegisterForm/>
    </div>
  )
}

export default RegisterCard