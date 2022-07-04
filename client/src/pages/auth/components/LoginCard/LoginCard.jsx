// LoginCard.jsx

import PropTypes from 'prop-types'
import style from './style.module.css'
import image from './assets/login-green.png'

import LoginForm from './LoginForm'

const LoginCard = ( {title, onLogin} ) => 
{
  return (
    <div className={style.LoginCard}>
        <img src={image} className={style.image} alt= "Welcome Image"/>
        <h1 className={style.welcomeText}> Welcome<br/>Back!</h1>
        <LoginForm title={title} onLogin={onLogin}/>
    </div>
  )
}

LoginCard.defaultProps = 
{
    title: 'Bytetools',
}

LoginCard.propTypes =
{
    title: PropTypes.string.isRequired,
}

export default LoginCard