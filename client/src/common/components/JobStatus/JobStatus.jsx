import style from './style.module.css'

const JobStatus = ({status}) => {
  const statusColor = (status) => {
    if(status === 'transcribe'){
      return '#EFA7A7'
    }
    if(status === 'review'){
      return '#FBCA5B'
    }
    return '#577590'
  } 
  return (
    <p 
      className={style.p}
      style={{ background: statusColor(status)}}
    >
      {status[0].toUpperCase() + status.substring(1)}
    </p>
  )
}

export default JobStatus