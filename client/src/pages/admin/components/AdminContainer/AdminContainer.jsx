import style from './style.module.css'
import { useGetAllActiveJobsQuery } from 'redux/slices/jobSlice'
import Protect from 'common/components/Protect'
import moment from 'moment'
import { GoKebabVertical } from 'react-icons/go'
import Button from 'common/components/Button'
import { downloadFile } from 'common/utils/fileServices'
import { useSelector } from 'react-redux'

const AdminContainer = () => {
  const {data} = useGetAllActiveJobsQuery()
  const {token} = useSelector(state => state.auth)
  return (
    <Protect>
      <main className={style.adminContainer}>
        <header>
          <h1 className={style.h1}>Admin Page</h1>
        </header>
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
                      onClick={()=>downloadFile(fileid, token)}
                    />
                    <div><GoKebabVertical className={style.kebab}/></div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </Protect>
  )
}

export default AdminContainer