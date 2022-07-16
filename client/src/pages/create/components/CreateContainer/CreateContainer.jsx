import style from './style.module.css'
import Layout from 'common/components/Layout'
import Protect from 'common/components/Protect'
import CreateJobForm from '../CreateJobForm'

const createContainer = () => {
  return (
    <Protect>
      <main className={style.createContainer}>
        <header>
          <h1 className={style.h1}>Create Job</h1>
        </header>
        <CreateJobForm />
      </main>
    </Protect>
  )
}

export default createContainer