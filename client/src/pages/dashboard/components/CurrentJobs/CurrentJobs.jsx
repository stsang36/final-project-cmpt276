import style from './style.module.css'
import { useGetCurrentJobsQuery } from 'redux/slices/jobSlice'
import moment from 'moment'
import { GoKebabVertical } from 'react-icons/go'

const CurrentJobs = () => {
  const {data} = useGetCurrentJobsQuery()
  return (
    <section className={style.section}>
      <header className={style.header}>
        <h1 className={style.h1}>Your Current Jobs</h1>
      </header>
      <div className={style.jobsTable}>
        <header className={style.jobsHeader}>
          <div>ID</div>
          <div>Owner</div>
          <div>Created</div>
          <div>Deadline Date</div>
          <div>Deadline Time</div>
          <div>Time Left</div>
        </header>
        <div className={style.jobs}>
          {data && data.map((job, index) => {
            const deadline = moment(job.deadline)
            const deadlineDate = deadline.format('MM/DD/YYYY')
            const deadlineTime = deadline.format('h:mm a')
            const created = moment(job.created_at).fromNow()
            const timeLeft = moment(job.deadline).fromNow()

            return(
              <div className={style.job}>
                <div>{job.id}</div>
                <div>yo mama</div>
                <div>{created}</div>
                <div>{deadlineDate}</div>
                <div>{deadlineTime}</div>
                <div>{timeLeft}</div>
                <div><GoKebabVertical className={style.kebab}/></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CurrentJobs