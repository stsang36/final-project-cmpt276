import style from './style.module.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForgotPasswordMutation } from 'redux/slices/userSlice'
import Button from 'common/components/Button'
import { toast } from 'react-toastify'


const RecoverCard = () => {
  const [ forgotPassword, { isSuccess, isError, error, reset} ] = useForgotPasswordMutation()
  const [ user, setUser ] = useState('')
  
  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      handleRecover(event)
    }
  }

  const handleRecover = (event) => {
    event.preventDefault()
    if(!user){
      toast.warn('Please fill in all required fields')
      return
    }
    forgotPassword({user})
  }

  useEffect(() => {
    document.title = 'Bytetools | Password Recovery'
    return () => document.title = 'Bytetools'
  },[])

  useEffect(() => {
    if(isSuccess){
      toast.success('Please check your email for further instructions')
      setUser('')
    }
    if(isError){
      toast.error(`An error occured: ${error.data.message}`)
      reset()
    }
  },[isSuccess, isError, error, reset])

  return (
    <section className={style.recoverCard}>
      <h1 className={style.h1}>Recover Password</h1>
      <form aria-live='assertive' className={style.fieldset}> 
        <input
          aria-required='true'
          className={style.input}
          type='text'
          value={user}
          placeholder='Username or Email'
          onChange={(e)=>setUser(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {!isSuccess &&
        <Link
          className={style.a} 
          to='/auth/login'
        >
          Go back to login page
        </Link>
        }
        {isSuccess && 
          <p className={style.message}>
            Please check your email for further instructions
          </p>
        }
      </form>
      <Button 
        text='Submit'
        className={style.button}
        onClick={handleRecover}
      />
    </section>
  )
}

export default RecoverCard