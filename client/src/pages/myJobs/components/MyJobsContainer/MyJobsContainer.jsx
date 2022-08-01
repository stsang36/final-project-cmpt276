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
        <header>
          <h1 className={style.h1}>My Jobs</h1>
        </header>
        <section>
          <MyJobsTable/>
        </section>
      </main>
    </Protect>
  )
}

export default MyJobsContainer