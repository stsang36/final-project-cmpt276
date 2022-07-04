import style from './style.module.css'
import logo from './assets/logo.png'
import Button from './Button'
import Register from './Register'
import Recover from './Recover'
import { useState } from 'react'

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
            <Register />
            <div>
                <input  className={style.form}
                        type='email' 
                        placeholder='Email Address'
                        vaule={email}
                        onChange={(event) => setEamil(event.target.value)}
                />
            </div>
            <div>
                <input  className={style.form}
                        type='password' 
                        placeholder='Password'
                        vaule={password}
                        onChange={(event) => setPW(event.target.value)}
                />
            </div>
            <Recover />
            <Button text='Log in' onClick={onClick} />
      </fieldset>
    </form>
  )
}

export default LoginForm