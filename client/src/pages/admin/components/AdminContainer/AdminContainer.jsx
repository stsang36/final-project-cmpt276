import style from './style.module.css'
import Protect from 'common/components/Protect'
import ActiveJobsTable from '../ActiveJobsTable'

const AdminContainer = () => {
  return (
    <Protect>
      <main className={style.adminContainer}>
        <header>
          <h1 className={style.h1}>Admin Page</h1>
        </header>
        <ActiveJobsTable />
      </main>
    </Protect>
  )
}

export default AdminContainer