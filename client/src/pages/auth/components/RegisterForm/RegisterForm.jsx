// client/src/pages/auth/components/RegisterForm/RegisterForm.jsx
import style from './style.module.css'
import Button from 'common/components/Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from 'redux/slices/userSlice'
import { toast } from 'react-toastify'
import isEmail from 'validator/lib/isEmail'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [register, results] = useRegisterMutation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      onSubmit(event)
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if(!username || !email || !password || !confirmPassword){
      toast.warn('Please fill in all required fields')
      return
    }
    if(!isEmail(email)){
      toast.warn('incorrect email format')
      return
    }
    if(password !== confirmPassword){
      toast.warn('Passwords must match')
      return
    }
    register({username, email, password})
  }

  useEffect(()=>{
    const { isSuccess, isError, error, reset } = results
    if(isSuccess){
      toast.success('Account has been created')
      navigate('/')
    }
    if(isError){
      toast.error(`An error occured: ${error.data.message}`)
      reset()
    }
  },[results, navigate])

  return (
    <form className={style.form}>
      <h1 className={style.h1}>Create Account</h1>
      <fieldset className={style.fieldset}>
        <input
          aria-required='true'
          className={style.input}
          type="text" 
          placeholder='Username'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          aria-required='true'
          className={style.input}
          type="email" 
          placeholder='Email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          aria-required='true'  
          className={style.input}
          type='password' 
          placeholder='Password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          aria-required='true'
          className={style.input}
          type='password' 
          placeholder='Retype Password'
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          onKeyPress={handleKeyPress}
        />
      </fieldset>
      <Link 
        className={style.a} 
        to="/auth/login"
      >
        Already have an account?
      </Link>
      <Button 
        className={style.button}
        text='Register' 
        onClick={onSubmit}
      />
    </form>
  )
}

export default RegisterForm