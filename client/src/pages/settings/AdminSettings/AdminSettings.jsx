import style from './style.module.css'
import { useGetAppConfigQuery, useUpdateAppConfigMutation } from 'redux/slices/configSlice'
import { useState } from 'react'
import { useEffect } from 'react'
import Button from 'common/components/Button'
import { toast } from 'react-toastify'
import ChangePassword from '../ChangePassword'

const AdminSettings = () => {
  const { data } = useGetAppConfigQuery()
  const [ update, results ] = useUpdateAppConfigMutation()
  const [ edit, setEdit ] = useState(false)
  const [ editObj, setEditObj ] = useState(null)
  const [ changePassword, setChangePassword ] = useState(false)

  const handleSaveChanges = (event) => {
    event.preventDefault()
    update(editObj)
  }

  const handleToggleEdit = (event) => {
    event.preventDefault()
    if(edit){
      setEditObj({
        id: data.id,
        reviewersChannelId: !data.reviewersChannelId ? '' : data.reviewersChannelId,
        transcribersChannelId: !data.transcribersChannelId ? '' : data.transcribersChannelId,
        emailDomain: !data.emailDomain ? '' : data.emailDomain,
        toggleDiscordNotif: data.toggleDiscordNotif,
        toggleEmailNotif: data.toggleEmailNotif,
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
        reviewersChannelId: !data.reviewersChannelId ? '' : data.reviewersChannelId,
        transcribersChannelId: !data.transcribersChannelId ? '' : data.transcribersChannelId,
        emailDomain: !data.emailDomain ? '' : data.emailDomain,
        toggleDiscordNotif: data.toggleDiscordNotif,
        toggleEmailNotif: data.toggleEmailNotif,
      })
    }
  },[data])

  return (
    <section className={style.section}>
      <h1 className={style.h1}>{changePassword ? 'Change Admin Password' : 'App Configurations'}</h1>
      {editObj && !changePassword && (
        <form className={style.form}>
          <label className={style.label}>
            Reviewers Channel ID 
            <input
              name='reviewersChannelId' 
              value={editObj.reviewersChannelId} 
              disabled={!edit}
              onChange={handleInputChange}
              type='text'
            />
          </label>
          <label className={style.label}>
            Transcribers Channel ID
            <input
              name='transcribersChannelId' 
              value={editObj.transcribersChannelId} 
              disabled={!edit}
              onChange={handleInputChange}
              type='text'
            />
          </label>
          <label className={style.label}>
            Email Domain 
            <input 
              name='emailDomain'
              value={editObj.emailDomain} 
              disabled={!edit}
              onChange={handleInputChange}
              type='email'
            />
          </label>
          <label className={style.label}>
            Toggle Discord Notifications
            <input
              name='toggleDiscordNotif' 
              checked={editObj.toggleDiscordNotif} 
              disabled={!edit}
              onChange={handleInputChange}
              type='checkbox'
            />
          </label>
          <label className={style.label}>
            Toggle Email Notifications 
            <input 
              name='toggleEmailNotif'
              checked={editObj.toggleEmailNotif} 
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

export default AdminSettings