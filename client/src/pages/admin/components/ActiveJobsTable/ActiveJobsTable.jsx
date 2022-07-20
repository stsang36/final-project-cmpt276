import moment from 'moment'
import { GoKebabVertical } from 'react-icons/go'
import Button from 'common/components/Button'
import Dropdown from 'common/components/Dropdown'
import { useGetAllActiveJobsQuery, useDeleteJobMutation } from 'redux/slices/jobSlice'
import { downloadFile } from 'redux/slices/fileSlice'
import { useDispatch } from 'react-redux'
import style from './style.module.css'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const ActiveJobsTable = () => {
  const dispatch = useDispatch()
  const {data} = useGetAllActiveJobsQuery()
  const [deleteJob, results] = useDeleteJobMutation()

  // add modal and confirmation
  const handleDeleteJob = (event, id) => {
    deleteJob({id})
  }

  const handleDownload = (event, fileid) => {
    console.log(fileid)
  }

  useEffect(() => {
    const {isSuccess, isError, error, reset} = results
    if(isSuccess){
      toast.success('Successfully Deleted Job')
      reset()
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.message}`)
      reset()
      return
    }
  },[results])

  return (
    <section className={style.section}>
      <header className={style.header}>
        <h1 className={style.h1}>All Active Jobs</h1>
      </header>
      <div className={style.jobsTable}>
        <header className={style.jobsHeader}>
          <div>ID</div>
          <div>Owner</div>
          <div>Created</div>
          <div>Deadline Date</div>
          <div>Deadline Time</div>
          <div>Time Left</div>
          <div>Transcribe File</div>
        </header>
        <div className={style.jobs}>
          {data && data.map((job, index) => {
            const deadline = moment(job.deadline)
            const deadlineDate = deadline.format('MM/DD/YYYY')
            const deadlineTime = deadline.format('h:mm a')
            const created = moment(job.created_at).fromNow()
            const timeLeft = moment(job.deadline).fromNow()
            const fileid = job.transcribe_fileid
            return(
              <div className={style.job}>
                <div>{job.id}</div>
                <div>{job.owner_id}</div>
                <div>{created}</div>
                <div>{deadlineDate}</div>
                <div>{deadlineTime}</div>
                <div>{timeLeft}</div>
                <Button 
                  text='download' 
                  onClick={() => dispatch(downloadFile(fileid))}
                />
                <Dropdown>
                  <GoKebabVertical className={style.kebab}/>
                  {/* <button disabled={true}>View Job</button>
                  <button disabled={true}>Download file</button> */}
                  <button onClick={(e)=>handleDeleteJob(e, job.id)}>Delete Job</button>
                </Dropdown>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ActiveJobsTable