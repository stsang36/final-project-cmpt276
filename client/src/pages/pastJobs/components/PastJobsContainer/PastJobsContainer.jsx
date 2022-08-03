import style from './style.module.css'
import Protect from 'common/components/Protect'
import { useEffect } from 'react'
import PastJobsTable from '../PastJobsTable'

const PastJobsContainer = () => {
  useEffect(()=>{
    document.title = 'Bytetools | Past Jobs'
    return () => document.title = 'Bytetools'
  },[])
  return (
    <Protect>
      <main className={style.main}>
        <header className={style.header}>
          <h1 className={style.h1}>Past Jobs</h1>
          <p className={style.p}> ~ the last 20 jobs that you have worked on will show up here </p>
        </header>
        <section>
          <PastJobsTable/>
        </section>
      </main>
    </Protect>
  )
}

export default PastJobsContainer