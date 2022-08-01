import style from './style.module.css'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from 'redux/slices/userSlice'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from 'common/components/Button'
import ChangePassword from '../ChangePassword'



const UserSettings = () => {
  const { data } = useGetUserSettingsQuery()
  const [ updateSettings, results ] = useUpdateUserSettingsMutation()
  const [ edit, setEdit ] = useState(false)
  const [ editObj, setEditObj ] = useState(null)
  const [ changePassword, setChangePassword ] = useState(false)

  const handleSaveChanges = (event) => {
    event.preventDefault()
    updateSettings(editObj)
  }

  const handleToggleEdit = (event) => {
    event.preventDefault()
    if(edit){
      setEditObj({
        id: data.id,
        username: data.username,
        email: data.email ? data.email : '',
        discordId: data.discordId ? data.discordId : '',
        toggleDiscordPm: data.toggleDiscordPm,
        toggleEmailNotification: data.toggleEmailNotification,
      })
    }
    setEdit(prev => !prev)
  }

  const handleInputChange = (event) => {
    const { type, value, name } = event.target
    if(type === 'checkbox'){
      setEditObj(prev => ({
        ...prev,
        [name]: event.target.checked
      }))
      return
    }
    setEditObj(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const { isSuccess, isError, error, reset } = results
    if(isSuccess){
      toast.success('updated settings')
      setEdit(false)
      reset()
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.message}`)
      reset()
      return
    }
  },[results])
  
  useEffect(()=>{
    if(data){
      setEditObj({
        id: data.id,
        username: data.username,
        email: data.email ? data.email : '',
        discordId: data.discordId ? data.discordId : '',
        toggleDiscordPm: data.toggleDiscordPm,
        toggleEmailNotification: data.toggleEmailNotification,
      })
    }
  },[data])

  return (
    <section className={style.section}>
      <h1 className={style.h1}>{changePassword ? 'Change Password' : 'User Configurations'}</h1>
      {editObj && !changePassword &&(
        <form className={style.form}>
          <label className={style.label}>
            Username
            <input
              name='username' 
              value={editObj.username} 
              disabled={!edit}
              onChange={handleInputChange}
              type='text'
            />
          </label>
          <label className={style.label}>
            Email
            <input
              name='email' 
              value={editObj.email} 
              disabled={!edit}
              onChange={handleInputChange}
              type='email'
            />
          </label>
          <label className={style.label}>
            Discord ID
            <input 
              name='discordId'
              value={editObj.discordId} 
              disabled={!edit}
              onChange={handleInputChange}
              type='text'
            />
          </label>
          <label className={style.label}>
            Toggle Discord Private Message
            <input
              name='toggleDiscordPm' 
              checked={editObj.toggleDiscordPm} 
              disabled={!edit}
              onChange={handleInputChange}
              type='checkbox'
            />
          </label>
          <label className={style.label}>
            Toggle Email Notifications
            <input 
              name='toggleEmailNotification'
              checked={editObj.toggleEmailNotification} 
              disabled={!edit}
              onChange={handleInputChange}
              type='checkbox'
            />
          </label>
          <ul className={style.btnList}>
            <li>
              <Button
                className={style.editBtn}
                onClick={handleToggleEdit}
                text={edit ? 'Cancel' : 'Edit Settings'}
              />
            </li>
            {!edit && (
              <Button
                className={style.editBtn} 
                text='Change Password'
                onClick={(e)=>{
                  e.preventDefault()
                  setChangePassword(true)
                }}
              />
            )}
            {edit && (
              <li>
                <Button 
                  className={style.saveChangesBtn}
                  onClick={handleSaveChanges}
                  text='Save Changes'
                />
              </li>
            )}
          </ul>
        </form>
      )}
      {changePassword && (
        <ChangePassword goBack={()=>setChangePassword(false)}/>
      )}
    </section>
  )
}


export default UserSettings