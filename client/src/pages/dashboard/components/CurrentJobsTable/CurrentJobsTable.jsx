import style from './style.module.css'
import { useGetCurrentJobsQuery } from 'redux/slices/jobSlice'
import moment from 'moment'
import { GoKebabVertical } from 'react-icons/go'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GiExpand } from 'react-icons/gi'
import { FiUpload } from 'react-icons/fi'
import { calculateTimeLeft } from 'common/utils/calculateTimeLeft'
import JobStatus from 'common/components/JobStatus'
import Dropdown from 'common/components/Dropdown'

const CurrentJobsTable = () => {
  const {data} = useGetCurrentJobsQuery()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <section className={style.section}> 
      <header>
        <h1 className={style.h1}>Your Current Jobs</h1>
      </header>
      <table className={style.table}>
        <thead>
          <tr className={style.tableHeader}>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Claimed</th>
            <th>Created</th>
            <th>Deadline Date</th>
            <th>Deadline Time</th>
            <th>Time Left</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data && data.length === 0 && (
            <tr className={style.emptyTableRow}>
              <td className={style.emptyMsg} colSpan={'100%'}>You have not claimed any jobs</td>
            </tr>
          )}
          {data && data.map((job, index) => {
            const timeLeft = calculateTimeLeft(moment(job.deadline))
            const deadline = moment(job.deadline)
            const deadlineDate = deadline.format('MM/DD/YYYY')
            const deadlineTime = deadline.format('hh:mma')
            return(
              <tr 
                className={style.tableRow}
                key={index}
                onClick={()=>navigate(`/viewjob/${job.id}`, { state: { backgroundLocation: location }})}
              >
                <td>{job.id}</td>
                <td>{job.name}</td>
                <td className={style.jobStatus}>
                  <JobStatus status={job.status}/>
                </td>
                <td>{job.claimed_userid ? 'Yes' : 'No'}</td>
                <td>{moment(job.created_at).fromNow()}</td>
                <td>{deadlineDate}</td>
                <td>{deadlineTime}</td>
                <td>{timeLeft ? timeLeft : 'Past Due'}</td>
                <td onClick={(e)=> e.stopPropagation()}>
                  <Dropdown>
                    <GoKebabVertical className={style.kebab}/>
                    <Link 
                      className={style.dropdownLink}
                      key={job.id}
                      to={`/viewjob/${job.id}`}
                      state={{ backgroundLocation: location }}
                    >
                      <GiExpand className={style.icon}/>
                      View
                    </Link>
                    <Link 
                      className={style.dropdownLink}
                      key={job.id}
                      to={`/updateJob/${job.id}`}
                      state={{ backgroundLocation: location }}
                    >
                      <FiUpload className={style.icon}/>
                      Upload File
                    </Link>
                  </Dropdown>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default CurrentJobsTable