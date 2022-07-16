import { useGetAvailableJobsQuery, useClaimJobMutation } from "redux/slices/jobSlice"
import { downloadFile } from 'common/utils/fileServices'
import style from './style.module.css'
import moment from 'moment'
import Button from 'common/components/Button'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const AvailableJobs = () => {
  const { data, isError, error, refetch } = useGetAvailableJobsQuery()
  const [ claimJob, results ] = useClaimJobMutation()

  const { token } = useSelector(state => state.auth)
  const handledownload = (event, fileid) => {
    downloadFile(fileid, token)
  }

  useEffect(()=>{
    const {isSuccess, isError, error, reset} = results
    if(isSuccess){
      toast.success('Job has been claimed')
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.message}`)
      reset()
      return
    }
  },[results])

  useEffect(() => {
    if(isError){
      toast.error(`An error occured: ${error.message}`)
    }
  },[isError, error])

  if(isError){
    <section className={style.section}>
      <header>
        <h1 className={style.h1}>Available Jobs For You</h1>
        <Button 
          text='Refresh'
          onClick={()=>refetch()} // does not work
        />
      </header>
      <div className={style.jobs}>
        <div>An error occured, please try refreshing the list</div>
      </div>
    </section>
  }
  return (
    <section className={style.section}>
      <header className={style.header}>
        <h1 className={style.h1}>Available Jobs For You</h1>
        <Button 
          text='Refresh'
        />
      </header>
      <div className={style.jobs}>
        {data && data.map((job, index) => {
          const deadline = moment(job.deadline).format('MMMM Do YYYY, h:mm a')
          const timeLeft = moment(job.deadline).fromNow()
          const createdAt = moment(job.created_at).fromNow()
          const { id } = job
          return(
            <div 
              className={style.jobCard}
              key={index}
            >
              <h1>Time Left: {timeLeft}</h1>
              <div>Deadline: {deadline}</div>
              <div>Created: {createdAt}</div>
              <div>Owner: {job.owner_id}</div>
              <button onClick={(e)=>handledownload(e, job.transcribe_fileid)}>Download File</button>
              <Button
                text='Claim Job'
                className={style.btn}
                onClick={()=>claimJob({id})} 
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default AvailableJobs