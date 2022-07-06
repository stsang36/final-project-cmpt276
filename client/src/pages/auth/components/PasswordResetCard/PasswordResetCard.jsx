import style from './style.module.css'
import Button from 'common/components/Button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { useResetPasswordMutation } from 'redux/apis/serverApi'

const PasswordResetCard = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [ resetPassord, results ] = useResetPasswordMutation()
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      handleChangePassword()
    }
  }

  const handleChangePassword = () => {
    if(!password || !confirmPassword){
      toast.warn('Please fill in all fields')
      return
    }
    if(password !== confirmPassword){
      toast.warn('Passwords must match')
      return
    }
    resetPassord({token, password})
  }

  useEffect(()=>{
    const { isSuccess, isError, error, reset } = results
    if(isSuccess){
      toast.success('Password has been reset')
      toast.success('Logging in...')
      navigate('/')
    }
    if(isError){
      toast.error(`An error occured: ${error.data.message}`)
      reset()
    }
  },[results, navigate])

  return (
    <div className={style.passwordResetCard}>
      <h1 className={style.h1}>Reset Password</h1>
      <input 
        className={style.input}
        type='password'
        placeholder='New Password'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <input 
        className={style.input}
        type='password'
        placeholder='Retype Password'
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button 
        className={style.button}
        text='Confirm Change'
        onClick={handleChangePassword}
      />
    </div>
  )
}

export default PasswordResetCard
