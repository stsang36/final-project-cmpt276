import Protect from 'common/components/Protect'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useGetAvailableJobsQuery } from 'redux/slices/jobSlice'
import style from './style.module.css'
import moment from 'moment'
import { downloadFile } from 'common/utils/fileServices'
import Layout from 'common/components/Layout'
import AvailableJobsTable from '../AvailableJobs'
import CurrentJobs from '../CurrentJobs'

const HomeContainer = () => {
  const { user, token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isLoading, isSuccess, isError } = useGetAvailableJobsQuery()

  const handleDownloadFile = (job) => {
    downloadFile(job.transcribe_fileid, token)
  }

  return (
    <Protect>
      <main className={style.homeContainer}>
        <header>
          <h1 className={style.h1}>Dashboard</h1>
        </header>
        <AvailableJobsTable />
        <CurrentJobs />
      </main>
    </Protect>
  )
}

export default HomeContainer