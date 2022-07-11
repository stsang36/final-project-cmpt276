import style from './style.module.css'
import Layout from 'common/components/Layout'
import Protect from 'common/components/Protect'
import CreateJobForm from '../CreateJobForm'

const createContainer = () => {
  return (
    <Protect>
      <Layout>
        <main className={style.createContainer}>
          <CreateJobForm />
        </main>
      </Layout>
    </Protect>
  )
}

export default createContainer