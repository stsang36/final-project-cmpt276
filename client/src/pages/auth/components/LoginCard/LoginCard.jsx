// LoginCard.jsx
import PropTypes from 'prop-types'
import style from './style.module.css'
import image from '../assets/login-green.png'
import LoginForm from '../LoginForm/LoginForm'

const LoginCard = () => 
{

  // Submit Login information
  const login = (info) =>
  {
    console.log(info)
  }


  return (
    <div className={style.LoginCard}>
        <img src={image} className={style.image} alt= "Welcome Image"/>
        <h1 className={style.welcomeText}> Welcome<br/>Back!</h1>
        <LoginForm title='Bytetools' onLogin={login}/>
    </div>
  )
}

export default LoginCard