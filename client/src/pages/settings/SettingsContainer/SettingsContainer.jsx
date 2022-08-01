import style from './style.module.css'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Protect from 'common/components/Protect'
import AdminSettings from '../AdminSettings'
import UserSettings from '../UserSettings'

const SettingsContainer = () => {
  const { role } = useSelector(state => state.auth.user)

  useEffect(()=>{
    document.title = 'Bytetools | Settings'
    return () => document.title = 'Bytetools'
  },[])

  return (
    <Protect>
      <main className={style.main}>
        <header>
          <h1 className={style.h1}>Settings</h1>
        </header>
        {role === 'admin' ? (
          <AdminSettings/>
        ) : (
          <UserSettings />
        )}
      </main>
    </Protect>
  )
}

export default SettingsContainer