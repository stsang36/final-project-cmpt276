import { useEffect, useState, useRef } from 'react'
import style from './style.module.css'
import Button from 'common/components/Button'
import moment from 'moment'
import { useCreateJobMutation } from 'redux/slices/jobSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import FileInput from '../../../../common/components/FileInput'

const CreateJobForm = () => {
  const navigate = useNavigate()
  const ref = useRef()
  const [ createJob, results ] = useCreateJobMutation()
  const [ file, setFile ] = useState('') 
  const [ deadline, setDeadline ] = useState(moment().add(1, 'day').format())
  const [ name, setName ] = useState('')
  const [ disableSubmit, setDisableSubmit ] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if(!file || !deadline || !name){
      toast.warn('Must include deadline, file and name')
      return
    }
    createJob({file, deadline, name})
  }

  const handleDateTimeChange = (event) => {
    const { value } = event.target
    const datetime = moment(value).format()
    if(moment().add(1, 'day').isAfter(moment(value))){
      toast.warn("deadlines cannot be set within 24 hours")
      ref.current.value = moment().add(1, 'day').format('YYYY-MM-DDThh:mm')
      return
    }
    setDeadline(datetime)
  }

  useEffect(()=>{
    const { isSuccess, isError, error, reset } = results
    if(isSuccess){
      toast.success('Job created')
      navigate('/myjobs')
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.data.message}`)
      reset()
    }
  },[results, navigate])

  return (
    <form className={style.form}>
      <h1 className={style.h1}>Job Form</h1>
      <FileInput 
        maxFiles={3}
        setSubmitFile={setFile}
        status='transcribe'
        setDisableSubmit={setDisableSubmit}
      />
      <label htmlFor='name' className={style.nameInput}>
        Job Name:
        <input
          type='text'
          onChange={(e)=>setName(e.target.value)}
          placeholder='Enter a name here'
        />
      </label>
      <label htmlFor='deadlineInput' className={style.deadlineInput}>
        Select a deadline:
        <input
          className={style.inputDate} 
          type='datetime-local'
          onBlur={handleDateTimeChange}
          defaultValue={moment().add(1, 'day').format('YYYY-MM-DDThh:mm')}  // default value is a day from now
          ref={ref}
          id='deadlineInput'
        />
      </label>
      <Button 
        className={style.submitBtn}
        text='Submit'
        onClick={handleSubmit}
        disabled={disableSubmit}
      />
    </form>
  )
}

export default CreateJobForm