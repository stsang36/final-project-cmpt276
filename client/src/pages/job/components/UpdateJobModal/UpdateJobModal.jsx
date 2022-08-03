import { useParams, useNavigate } from 'react-router' 
import { useGetJobQuery, useUpdateJobMutation } from 'redux/slices/jobSlice'
import FileInput from 'common/components/FileInput'
import Modal from 'common/components/Modal'
import style from './style.module.css'
import { useState, useEffect } from 'react' 
import Button from 'common/components/Button'
import JobStatus from 'common/components/JobStatus'
import { FaLongArrowAltRight} from 'react-icons/fa'
import { toast } from 'react-toastify'

const generateNewStatus = (status) => {
  if(status === 'transcribe'){
    return 'review'
  }
  return 'complete'
}

const UpdateJobModal = () => {
  const { id } = useParams()
  const [ updateJob, results ] = useUpdateJobMutation()
  const [ file, setFile ] = useState('')
  const [ disableSubmit, setDisableSubmit ] = useState(false)
  const { data } = useGetJobQuery({id})
  const navigate = useNavigate()

  const handleUploadFile = () => {
    if(!file){
      toast.warn('A file has to be uploaded before submitting')
      return
    }
    updateJob({id, file})
  }

  useEffect(()=>{
    const { isSuccess, isError, error, reset } = results
    if(isSuccess){
      toast.success('Job has been updated')
      reset()
      navigate(-1)
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.data.message}`)
      reset()
      return
    }
  },[results])

  return (
    <Modal
      closeModal={()=>navigate(-1)}
      type='center'
      className={style.modal}
    >
      {data && (
        <>
          <h1 className={style.h1}>{data.name}</h1>
          <p className={style.p}>
            Updating Job from 
            <JobStatus status={data.status} />
            <FaLongArrowAltRight className={style.icon}/>
            <JobStatus status={generateNewStatus(data.status)}/>
          </p>
          <FileInput
            setSubmitFile={setFile}
            setDisableSubmit={setDisableSubmit}
            status={data.status}
            supportedExtensions={['pdf', 'doc', 'docx', 'pptx', 'rtf', 'zip', 'md', 'html', 'txt']}
          />
          <ul className={style.btns}>
            <li>
              <Button
                className={style.cancelBtn} 
                text='Cancel'
                onClick={()=>navigate(-1)}
              />
            </li>
            <li>
              <Button 
                text='Upload File'
                disabled={disableSubmit}
                className={style.uploadBtn}
                onClick={handleUploadFile}
              />
            </li>
          </ul>
        </>
      )}
    </Modal>
  )
}

export default UpdateJobModal