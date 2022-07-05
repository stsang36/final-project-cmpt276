// client/src/pages/auth/components/LoginForm/LoginForm.jsx

import style from './style.module.css'
import logo from '../assets/logo.png'
import Button from 'common/components/Button'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginForm = ( {title, onLogin} ) => 
{
  const [email, setEamil] = useState('')
  const [password, setPW] = useState('')

  const onClick = () => 
  {
    console.log('Click')
  }

  const onSubmit = (event) =>
  {
    event.preventDefault()

    if(!email)
    {
        alert('Please insert a valid email')
        return
    }

    onLogin( {email, password} )
    
    setEamil('')
    setPW('')
  }

  return (
    <form action="" onSubmit={onSubmit}>
      <fieldset className={style.fieldset}>
        <img src={logo} className={style.logo} alt="Bytetools Logo" />
          <h1 className={style.title}> {title} </h1>
            <h6 className = {style.register}>
              New to Bytetools?&nbsp;&nbsp;
              <Link to="/auth/register">Create account</Link>
            </h6>
            <div>
                <input  className={style.form}
                        type='email' 
                        placeholder='Email Address'
                        value={email}
                        onChange={(event) => setEamil(event.target.value)}
                />
            </div>
            <div>
                <input  className={style.form}
                        type='password' 
                        placeholder='Password'
                        value={password}
                        onChange={(event) => setPW(event.target.value)}
                />
            </div>
            <p className={style.recover}>
              <Link to="/auth/recover">Forgot Password?</Link>
            </p>
            <Button text='Log in' 
                    onClick={onClick} 
                    style=
                    {
                      {
                        position: 'relative',
                        top: '90px',
                        right: '93px',
                        width: '250px',
                        height: '40px',
                        borderColor: 'transparent',
                        borderRadius: '15px',
                        backgroundColor: 'rgb(0, 168, 0)',
                        color: 'rgb(46, 46, 46)',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        boxShadow: '0px 5px 20px 3px rgba(126, 126, 126, 0.5)',
                      }
                    }
            />
      </fieldset>
    </form>
  )
}

export default LoginForm