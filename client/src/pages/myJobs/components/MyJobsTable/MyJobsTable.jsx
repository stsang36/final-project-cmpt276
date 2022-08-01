import style from './style.module.css'
import { useGetMyJobsQuery } from 'redux/slices/jobSlice'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import JobStatus from 'common/components/JobStatus'
import moment from 'moment'
import { calculateTimeLeft } from 'common/utils/calculateTimeLeft'
import Dropdown from 'common/components/Dropdown'
import { GoKebabVertical } from 'react-icons/go'
import { GiExpand } from 'react-icons/gi'


const MyJobsTable = () => {
  const { role } = useSelector(state => state.auth.user)
  const { data } = useGetMyJobsQuery()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <section className={style.section}> 
      <table className={style.table}>
        <thead>
          <tr className={style.tableHeader}>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            {role !== 'client' && <th>Claimed</th>}
            <th>Created</th>
            <th>Deadline Date</th>
            <th>Deadline Time</th>
            {role !== 'client' && <th>Time Left</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data && data.length === 0 && (
            <tr className={style.emptyTableRow}>
              <td className={style.emptyMsg} colSpan={'100%'}>You have not created any jobs</td>
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
                  <JobStatus 
                    client={role === 'client'}
                    status={job.status}
                  />
                </td>
                {role !== 'client' && <td>{job.claimed_userid ? 'Yes' : 'No'}</td>}
                <td>{moment(job.created_at).fromNow()}</td>
                <td>{deadlineDate}</td>
                <td>{deadlineTime}</td>
                {role !== 'client' && <td>{timeLeft ? timeLeft : 'Past Due'}</td>}
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

export default MyJobsTable