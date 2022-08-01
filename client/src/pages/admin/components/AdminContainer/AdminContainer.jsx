import style from './style.module.css'
import Protect from 'common/components/Protect'
import ActiveJobsTable from '../ActiveJobsTable'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'
import ArchivedJobsTable from '../ArchivedJobsTable'
import UsersTable from '../UsersTable'

const AdminContainer = () => {
  const sections = [
    {
      id: 1,
      name: 'Active Jobs'
    },
    {
      id: 2,
      name: 'Archived Jobs'
    },
    {
      id: 3,
      name: 'All Users'
    }
  ]

  const [ index, setIndex ] = useState(0)
  return (
    <Protect roles={['admin']}>
      <main className={style.adminContainer}>
        <header>
          <h1 className={style.h1}>Admin Page</h1>
        </header>
        <section>
          <header className={style.sectionHeader}>
            <h1 className={style.currentTable}>
              {sections[index].name}
            </h1>
            <ul className={style.navBtns}>
              <li>
                <button 
                  className={style.navBtn}
                  onClick={()=>setIndex(prev => prev === 0 ? sections.length - 1 : prev - 1)}
                >
                  <FaChevronLeft/>
                </button>
              </li>
              <li>
                <button 
                  className={style.navBtn}
                  onClick={()=>setIndex(prev => prev === sections.length - 1 ? 0 : prev + 1)}
                >
                  <FaChevronRight/>
                </button>
              </li>
            </ul>
          </header>
          {sections[index].id === 1 && (
             <ActiveJobsTable />
          )}
          {sections[index].id === 2 && (
            <ArchivedJobsTable />
          )}
          {sections[index].id === 3 && (
            <UsersTable />
          )}
        </section>
      </main>
    </Protect>
  )
}

export default AdminContainer