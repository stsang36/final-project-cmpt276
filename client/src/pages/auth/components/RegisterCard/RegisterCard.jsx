// client/src/pages/auth/components/RegisterCard/RegisterCard.jsx

import style from './style.module.css'
import image from '../assets/stub-image.png'
import RegisterForm from '../RegisterForm'

const RegisterCard = () => 
{

  const register = (info) =>
  {
    console.log(info)
  }

  return (
    <div className={style.RegisterCard}>
      <img src={image} className={style.image} alt="Register Image" />
      <RegisterForm title='Create Account' onRegister={register} />
    </div>
  )
}

export default RegisterCard