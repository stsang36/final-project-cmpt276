// client/src/pages/auth/components/LoginForm/LoginForm.jsx

import style from './style.module.css'
import logo from '../assets/logo.png'
import Button from 'common/components/Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLoginMutation } from 'redux/apis/serverApi'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ login, results ] = useLoginMutation()
  const navigate = useNavigate()

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      onSubmit()
    }
  }
  
  const onSubmit = () => {
    if(!username || !password){
      toast.warn('Please fill in all required fields')
      return
    }
    login({username, password})
  }

  useEffect(() => {
    const { isSuccess, isError, error } = results
    if(isSuccess){
      toast.success('Signed In Successfully')
      navigate('/')
    }
    if(isError){
      toast.error(`An error occured: ${error.data.message}`)
    }
  },[results])

  return (
    <div className={style.form}>
      <div className={style.header}>
        <img src={logo} className={style.logo} alt="Bytetools Logo" />
        <h1 className={style.h1}>Bytetools</h1>
      </div>
      <div className={style.fieldset}>
        <div className={style.username}>
          <p className={style.p}>
            New to Bytetools? 
            <Link 
              to='/auth/register'
              className={style.a}
            >
              Create Account 
            </Link>
          </p>
          <input  
            className={style.input}
            type='username' 
            placeholder='Username or Email'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className={style.password}>
          <input  
            className={style.input}
            type='password' 
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Link
            to='/auth/recover'
            className={style.a}
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      <Button 
        className={style.button}
        text='Log in' 
        onClick={onSubmit}
      />
    </div>
  )
}

export default LoginForm
