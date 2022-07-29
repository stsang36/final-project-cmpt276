import { BsCircleFill } from 'react-icons/bs'
import style from './style.module.css'

const ActivityStatus = ({active, className}) => {
  return (
    <p 
      className={`${style.p} ${className}`}
      style={{
        color: active ? 'green' : 'grey',
        border: `1px solid ${active ? 'green' : 'grey'}`
      }}
    >
      <BsCircleFill className={style.icon}/>
      {active ? 'Active' : 'Archived'}
    </p>
  )
}

export default ActivityStatus