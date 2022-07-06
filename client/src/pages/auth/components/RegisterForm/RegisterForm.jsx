// client/src/pages/auth/components/RegisterForm/RegisterForm.jsx
import style from './style.module.css'
import Button from 'common/components/Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from 'redux/apis/serverApi'
import { toast } from 'react-toastify'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [register, results] = useRegisterMutation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      onSubmit()
    }
  }

  const onSubmit = () => {
    if(!username || !email || !password || !confirmPassword){
      toast.warn('Please fill in all required fields')
      return
    }
    if(password !== confirmPassword){
      toast.warn('Passwords must match')
      return
    }
    register({username, email, password})
  }

  useEffect(()=>{
    const { isSuccess, isError, error } = results
    if(isSuccess){
      toast.success('Account has been created')
      navigate('/')
    }
    if(isError){
      toast.error(`An error occured: ${error.data.message}`)
    }
  },[results, navigate])

  return (
    <div className={style.form}>
      <h1 className={style.h1}>Create Account</h1>
      <div className={style.fieldset}>
        <input  
          className={style.input}
          type="text" 
          placeholder='Username'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input  
          className={style.input}
          type="text" 
          placeholder='Email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input  
          className={style.input}
          type='password' 
          placeholder='Password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input  
          className={style.input}
          type='password' 
          placeholder='Retype Password'
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
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
    </div>
  )
}

// position: 'relative',
//                       top: '55px',
//                       right: '93px',
//                       width: '250px',
//                       height: '40px',
//                       borderColor: 'transparent',
//                       borderRadius: '15px',
//                       backgroundColor: 'rgb(0, 168, 0)',
//                       color: 'rgb(46, 46, 46)',
//                       fontSize: '18px',
//                       fontWeight: 'bold',
//                       boxShadow: '0px 5px 20px 3px rgba(126, 126, 126, 0.5)',

export default RegisterForm