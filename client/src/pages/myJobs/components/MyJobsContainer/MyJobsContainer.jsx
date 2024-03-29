import style from './style.module.css'
import Protect from 'common/components/Protect'
import { useEffect } from 'react'
import MyJobsTable from '../MyJobsTable'

const MyJobsContainer = () => {
  useEffect(()=>{
    document.title = 'Bytetools | My Jobs'
    return () => document.title = 'Bytetools'
  },[])
  return (
    <Protect>
      <main className={style.main}>
        <header className={style.header}>
          <h1 className={style.h1}>My Jobs</h1>
          <p  className={style.p}> ~ jobs you have created will be found here</p>
        </header>
        <section>
          <MyJobsTable/>
        </section>
      </main>
    </Protect>
  )
}

export default MyJobsContainer