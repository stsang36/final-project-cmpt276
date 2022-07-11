import Protect from 'common/components/Protect'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from 'redux/slices/authSlice'
import { toast } from 'react-toastify'
import { useGetAllJobsQuery } from 'redux/slices/jobSlice'
import style from './style.module.css'
import moment from 'moment'
import { downloadFile } from 'common/utils/fileServices'

const HomeContainer = () => {
  const { user, token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isLoading, isSuccess, isError } = useGetAllJobsQuery()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login')
    toast.success('logged out')
  }

  const handleDownloadFile = (job) => {
    downloadFile(job.transcribe_fileid, token)
  }

  return (
    <Protect>
      <div>
        <h1 className={style.h1}>Jobs</h1>
        <Link to='/create'>Create a new Job</Link>
        <section className={style.section}>
          {data && data.map((job, index) => (
            <div className={style.job}>
              <div>Job Deadline: {moment(job.deadline).format('MMMM Do YYYY, h:mm a')}</div>
              <div>Created At: {moment(job.created_at).format('MMMM Do YYYY, h:mm a')}</div>
              <div>Owner ID:  {job.owner_id}</div>
              <div>Status: {job.status}</div>
              <div className={style.btns}>
                <button
                  className={style.btn} 
                  onClick={()=>handleDownloadFile(job)}
                  disabled={job.transcribe_fileid === null}
                >
                  Transcribe files
                </button>
                <button
                  className={style.btn}  
                  onClick={()=>handleDownloadFile(job)}
                  disabled={job.review_fileid === null}
                >
                  Review files
                </button>
                <button
                  className={style.btn}  
                  onClick={()=>handleDownloadFile(job)}
                  disabled={job.complete_fileid === null}
                >
                  Completed files
                </button>
              </div>
            </div>
          ))}
        </section> 
        {user &&
          <>
            <div>
              Logged in as {user.username}
            </div>
            <button 
              onClick={handleLogout}
              className={style.btn}
            >
              Log out
            </button>
          </> 
        }
        {/* <div>Logged In as {user.username}</div>
        <button onClick={handleClick}>Log Out</button> */}
      </div>
    </Protect>
  )
}

export default HomeContainer