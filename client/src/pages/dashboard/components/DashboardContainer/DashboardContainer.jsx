import Protect from 'common/components/Protect'
import style from './style.module.css'
import AvailableJobsTable from '../AvailableJobs'
import CurrentJobs from '../CurrentJobsTable'

const HomeContainer = () => {
  return (
    <Protect roles={['transcriber', 'reviewer']}>
      <main className={style.main}>
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