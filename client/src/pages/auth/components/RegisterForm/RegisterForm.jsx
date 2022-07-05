// client/src/pages/auth/components/RegisterForm/RegisterForm.jsx

import style from './style.module.css'
import Button from 'common/components/Button'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const RegisterForm = ( {title, onRegister} ) => 
{
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEamil] = useState('')
  const [password, setPW] = useState('')
  const [confirmPW, setConfirmPW] = useState('');
  
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

    if(confirmPW != password)
    {
      alert('Password does not match')
      return
    }

    onRegister( {firstName, lastName, email, password, confirmPW} )
    
    setFirstName('')
    setLastName('')
    setEamil('')
    setPW('')
    setConfirmPW('')
  }

  return (
    <form action="" onSubmit={onSubmit}>
      <fieldset className={style.fieldset}>
        <h1 className={style.title}> {title} </h1>
        <div>
          <input  className={style.firstName}
                  type="text" 
                  placeholder='First Name'
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div>
          <input  className={style.lastName}
                  type="text" 
                  placeholder='Last Name'
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
          />
        </div>
        <div>
          <input  className={style.form}
                  type="email"
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
        <div>
          <input  className={style.form}
                  type='password' 
                  placeholder='Confirm Password'
                  value={confirmPW}
                  onChange={(event) => setConfirmPW(event.target.value)}
          />
        </div>
        <Button   text='Register' 
                  onClick={onClick}
                  style=
                  {
                    {
                      position: 'relative',
                        top: '55px',
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
        <p className={style.goBack}>
          <Link to="/auth/login">Go back to Login page</Link>
        </p>
      </fieldset>
    </form>
  )
}

export default RegisterForm