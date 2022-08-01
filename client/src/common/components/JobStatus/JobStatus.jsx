import style from './style.module.css'

const JobStatus = ({status, className, client=false}) => {
  const statusColor = (status) => {
    if(client){
      if(status === 'transcribe' || status === 'review'){
        return '#808080'
      }
      return '#046307'
    }
    if(status === 'transcribe'){
      return '#EFA7A7'
    }
    if(status === 'review'){
      return '#FBCA5B'
    }
    return '#577590'
  } 
  const calculateStatus = (status) => {
    if(status === 'transcribe' || status === 'review'){
      return 'In-progress'
    }
    return 'Complete'
  }
  return (
    <p 
      className={`${style.p} ${className}`}
      style={{ background: statusColor(status)}}
    >
      {client 
        ? calculateStatus(status)
        : status[0].toUpperCase() + status.substring(1)
      }
    </p>
  )
}

export default JobStatus