import { useGetAvailableJobsQuery, useClaimJobMutation } from "redux/slices/jobSlice"
import style from './style.module.css'
import moment from 'moment'
import Button from 'common/components/Button'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { calculateTimeLeft } from "common/utils/calculateTimeLeft"

const AvailableJobs = () => {
  const { data, isError, error, refetch } = useGetAvailableJobsQuery()
  const [ claimJob, results ] = useClaimJobMutation()

  useEffect(()=>{
    const {isSuccess, isError, error, reset} = results
    if(isSuccess){
      toast.success('Job has been claimed')
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.message}`)
      reset()
      return
    }
  },[results])

  useEffect(() => {
    if(isError){
      toast.error(`An error occured: ${error.message}`)
    }
  },[isError, error])

  if(isError){
    <section className={style.section}>
      <header>
        <h1 className={style.h1}>Available Jobs For You</h1>
        <Button 
          text='Refresh'
          onClick={refetch}
        />
      </header>
      <div className={style.jobs}>
        <div>An error occured, please try refreshing the list</div>
      </div>
    </section>
  }
  return (
    <section className={style.section}>
      <header className={style.header}>
        <h1 className={style.h1}>Available Jobs For You ({data && data.length})</h1>
        <Button 
          className={style.refreshBtn}
          text='Refresh'
          onClick={refetch}
        />
      </header>
      <section className={style.jobs}>
        {data && data.length === 0 && (
          <article 
            className={style.jobCard}
          >
            No available jobs right now, please check back in later!
          </article>
        )}
        {data && data.map((job, index) => {
          const deadline = moment(job.deadline)
          const deadlineDate = deadline.format('MMM D, YYYY')
          const deadlineTime = deadline.format('h:mma')
          const timeLeft = calculateTimeLeft(moment(job.deadline))
          const createdAt = moment(job.created_at).fromNow()
          const { id } = job
          return(
            <article 
              className={style.jobCard}
              key={index}
            >
              <ul className={style.jobInfo}>
                <li className={style.jobName}>
                  <p>Name:</p> 
                  <p>{job.name}</p>
                </li>
                <li>
                  <p>Time Left:</p>
                  <p>{timeLeft ? timeLeft : 'Past Due'}</p>
                </li>
                <li>
                  <p>Deadline Date:</p>
                  <p>{deadlineDate}</p>
                </li>
                <li>
                  <p>Deadline Time:</p>
                  <p>{deadlineTime}</p>
                </li>
                <li>
                  <p>Created:</p>
                  <p>{createdAt}</p>
                </li>
              </ul>
              <Button
                  text='Claim Job'
                  className={style.claimBtn}
                  onClick={()=>claimJob({id})} 
                />
            </article>
          )
        })}
      </section>
    </section>
  )
}

export default AvailableJobs