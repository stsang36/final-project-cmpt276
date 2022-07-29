import moment from 'moment'

// MUST BE A MOMENT OBJECT
export const calculateTimeLeft = (time) => {
  const currentTime = moment()
  if(currentTime.isAfter(time)){
    return null
  }
  const days = Math.floor(time.diff(currentTime, "days", true))
  const hours = Math.floor(time.diff(currentTime, "hours", true)) % 24
  const minutes = time.diff(currentTime, "minutes") % 60
  if(days > 0){
    return `${days} day${days > 1 ? 's' : ''} & ${hours} hour${hours > 1 ? 's' : ''}`
  }
  if(hours > 0 ){
    return `${hours} hour${hours > 1 ? 's' : ''} & ${minutes} min${minutes > 1 ? 's' : ''}`
  }
  return `${minutes} min${minutes > 1 ? 's' : ''}`
}