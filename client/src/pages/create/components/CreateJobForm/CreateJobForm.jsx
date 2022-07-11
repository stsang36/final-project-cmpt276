import { useEffect, useState, useRef } from 'react'
import style from './style.module.css'
import Button from 'common/components/Button'
import { Buffer } from 'buffer'
import moment from 'moment'
import { useCreateJobMutation } from 'redux/slices/jobSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CreateJobForm = () => {
  const navigate = useNavigate()
  const [ file, setFile ] = useState('') 
  const ref = useRef()
  const [ deadline, setDeadline ] = useState(moment().add(1, 'day').format())
  const [ createJob, results ] = useCreateJobMutation()

  const handleSubmit = (event) => {
    event.preventDefault()
    if(!file || !deadline){
      return
    }
    createJob({file, deadline})
  }

  const handleInputChange = async(event) => {
    const file = event.target.files[0]
    const arrBuf = await file.arrayBuffer()
    const buf = Buffer.from(arrBuf, 'base64')
    const base64Str = buf.toString('base64')
    setFile({
      name: file.name,
      media: base64Str,
      type: file.type,
      status: 'transcribe',
    })
  }

  const handleDateTimeChange = (event) => {
    const { value } = event.target
    const datetime = moment(value).format()
    if(moment().add(1, 'day').isAfter(moment(value))){
      alert('invalid time')
      ref.current.value = moment().add(1, 'day').format('YYYY-MM-DDThh:mm')
      return
    }
    setDeadline(datetime)
  }

  useEffect(()=>{
    const { isSuccess, isError, error, reset } = results
    if(isSuccess){
      toast.success('Job created')
      navigate('/')
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.message}`)
      reset()
    }
  },[results, navigate])

  return (
    <form className={style.form}>
      <h1 className={style.h1}>Create a new job request here</h1>
      <input 
        type='file'
        accept='.pdf, .docx, .pptx, .rtf, .zip, .md'
        onChange={handleInputChange}
      />
      <input
        type='datetime-local'
        onBlur={handleDateTimeChange}
        defaultValue={moment().add(1, 'day').format('YYYY-MM-DDThh:mm')}  // default value is a day from now
        ref={ref}
      />
      <Button 
        text='Submit'
        onClick={handleSubmit}
      />
    </form>
  )
}

export default CreateJobForm