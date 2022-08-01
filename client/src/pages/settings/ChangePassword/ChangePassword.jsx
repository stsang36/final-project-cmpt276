import style from './style.module.css'
import { useState, useEffect } from 'react'
import Button from 'common/components/Button'
import { useUpdatePasswordMutation } from 'redux/slices/userSlice'
import { toast } from 'react-toastify'

const ChangePassword = ({goBack}) => {
  const [oldPassword, setOldPassword ] = useState()
  const [newPassword, setNewPassword ] = useState()
  const [confirmPassword, setConfirmPassword ] = useState()
  const [ updatePassword, results ] = useUpdatePasswordMutation()

  const handleUpdate = (event) => {
    event.preventDefault()
    if(newPassword !== confirmPassword){
      toast.warn('Passwords must match')
      return
    }
    updatePassword({newPassword, oldPassword})
  }

  useEffect(()=>{
    const { isSuccess, isError, error, reset } = results
    if(isSuccess){
      toast.success('Password Updated')
      reset()
      goBack()
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.message}`)
      reset()
      return
    }
  },[results, goBack])

  return (
    <form className={style.form}>
      <label className={style.label}>
        Old Password
        <input
          type='password'
          onChange={(e)=>setOldPassword(e.target.value)} 
          value={oldPassword}
        />
      </label>
      <label className={style.label}>
        New Password
        <input
          type='password' 
          onChange={(e)=>setNewPassword(e.target.value)} 
          value={newPassword}
        />
      </label>
      <label className={style.label}>
        Confirm Password
        <input
          type='password' 
          onChange={(e)=>setConfirmPassword(e.target.value)} 
          value={confirmPassword}
        />
      </label>
      <ul className={style.btnList}>
        <li>
          <Button
            text='Go Back'
            onClick={goBack} 
            className={style.backBtn}
          />
        </li>
        <li>
          <Button
            text='Update'
            className={style.updateBtn} 
            onClick={handleUpdate}
          />
        </li>
      </ul>
    </form>
  )
}

export default ChangePassword