import style from './style.module.css'
import Protect from 'common/components/Protect'
import CreateJobForm from '../CreateJobForm'
import { useEffect } from 'react'

const CreateContainer = () => {
  useEffect(() => {
    document.title = 'Bytetools | Create a Job'
    return () => document.title = 'Bytetools'
  },[])

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

export default CreateContainer