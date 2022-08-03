import moment from 'moment'
import { GoKebabVertical } from 'react-icons/go'
import Button from 'common/components/Button'
import Dropdown from 'common/components/Dropdown'
import { useGetAllActiveJobsQuery, useDeleteJobMutation } from 'redux/slices/jobSlice'
import style from './style.module.css'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'common/components/Modal'
import { AnimatePresence } from 'framer-motion'
import { AiTwotoneAlert, AiFillDelete } from 'react-icons/ai'
import { GiExpand } from 'react-icons/gi'
import { Link, useLocation } from 'react-router-dom'
import JobStatus from 'common/components/JobStatus'
import { calculateTimeLeft } from 'common/utils/calculateTimeLeft'

const ActiveJobsTable = () => {
  const location = useLocation()
  const {data} = useGetAllActiveJobsQuery()
  const [deleteJob, results] = useDeleteJobMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [focusedJob, setFocusedJob] = useState(null)
  
  const handleClickDelete = (event, job) => {
    setFocusedJob(job)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = () => {
    const { id } = focusedJob
    deleteJob({id})
    setFocusedJob(null)
    setIsDeleteModalOpen(false)
  }
  
  const handleCancel = () => {
    setFocusedJob(null)
    setIsDeleteModalOpen(false)
  }


  useEffect(() => {
    const {isSuccess, isError, error, reset} = results
    if(isSuccess){
      toast.success('Successfully Deleted Job')
      reset()
      return
    }
    if(isError){
      toast.error(`${error.data.message}`)
      reset()
      return
    }
  },[results])

  return (
    <section className={style.section}>
      <AnimatePresence>
        {isDeleteModalOpen && 
          <Modal
            closeModal={()=>setIsDeleteModalOpen(false)}
            className={style.deleteModal}
          >
            <AiTwotoneAlert className={style.alertIcon}/>
            <p className={style.deleteMessage}>Are you sure you want to delete "{focusedJob.id}"?</p>
            <Button 
              className={style.cancelBtn}
              text='Cancel'
              onClick={handleCancel}
            />
            <Button
              className={style.deleteBtn}
              text='Delete' 
              onClick={handleDelete} 
            />
          </Modal>
        }
      </AnimatePresence>
      <table className={style.table}>
        <thead>
          <tr className={style.tableHeader}>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Claimed</th>
            <th>Created</th>
            <th>Deadline Date</th>
            <th>Deadline Time</th>
            <th>Time Left</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((job, index) => {
            const timeLeft = calculateTimeLeft(moment(job.deadline))
            const deadline = moment(job.deadline)
            const deadlineDate = deadline.format('MM/DD/YYYY')
            const deadlineTime = deadline.format('hh:mma')
            return(
              <tr 
                className={style.tableRow}
                key={index}
              >
                <td>{job.id}</td>
                <td>{job.name}</td>
                <td className={style.jobStatus}>
                  <JobStatus status={job.status}/>
                </td>
                <td>{job.claimed_userid ? 'Yes' : 'No'}</td>
                <td>{moment(job.created_at).fromNow()}</td>
                <td>{deadlineDate}</td>
                <td>{deadlineTime}</td>
                <td>{timeLeft ? timeLeft : 'Past Due'}</td>
                <td>
                  <Dropdown>
                    <GoKebabVertical className={style.kebab}/>
                    <Link 
                      className={style.dropdownLink}
                      key={job.id}
                      to={`/viewjob/${job.id}`}
                      state={{ backgroundLocation: location }}
                    >
                      <GiExpand className={style.icon}/>
                      View
                    </Link>
                    <button 
                      className={style.dropdownBtn}
                      onClick={(e)=>handleClickDelete(e, job)}>
                      <AiFillDelete className={style.icon}/>
                      Delete
                    </button>
                  </Dropdown>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default ActiveJobsTable