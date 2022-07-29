import moment from 'moment'
import { GoKebabVertical } from 'react-icons/go'
import Button from 'common/components/Button'
import Dropdown from 'common/components/Dropdown'
import { useGetAllActiveJobsQuery, useDeleteJobMutation } from 'redux/slices/jobSlice'
import { downloadFile } from 'redux/slices/fileSlice'
import { useDispatch } from 'react-redux'
import style from './style.module.css'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'common/components/Modal'
import { AnimatePresence } from 'framer-motion'
import { AiFillAlert } from 'react-icons/ai'
import JobModal from '../../../job/components/JobModal'
import { Link, useLocation } from 'react-router-dom'
import { MdDeleteForever } from 'react-icons/md'
import { CgExpand } from 'react-icons/cg'

const ActiveJobsTable = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const {data} = useGetAllActiveJobsQuery()
  const [deleteJob, results] = useDeleteJobMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
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

  const handleViewJob = (event, job) => {
    setFocusedJob(job)
    setIsJobModalOpen(true)
  }

  useEffect(() => {
    const {isSuccess, isError, error, reset} = results
    if(isSuccess){
      toast.success('Successfully Deleted Job')
      reset()
      return
    }
    if(isError){
      toast.error(`An error occured: ${error.message}`)
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
            <AiFillAlert className={style.alertIcon}/>
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
      <AnimatePresence>
        {isJobModalOpen && 
          <JobModal
            closeModal={()=>{
              setIsJobModalOpen(false)
              setFocusedJob(null)
            }}
            job={focusedJob}
          />
        }
      </AnimatePresence>
      <header className={style.header}>
        <h1 className={style.h1}>All Active Jobs</h1>
      </header>
      <div className={style.jobsTable}>
        <header className={style.jobsHeader}>
          <div>ID</div>
          <div>Owner</div>
          <div>Claimed User</div>
          <div>Created</div>
          <div>Deadline Date</div>
          <div>Deadline Time</div>
          <div>Time Left</div>
          <div>Transcribe File</div>
        </header>
        <div className={style.jobs}>
          {data && data.map((job, index) => {
            const deadline = moment(job.deadline)
            const deadlineDate = deadline.format('MM/DD/YYYY')
            const deadlineTime = deadline.format('h:mm a')
            const created = moment(job.created_at).fromNow()
            const timeLeft = moment(job.deadline).fromNow()
            const fileid = job.transcribe_fileid
            const claimed_user = job.claimed_userid ? job.claimed_userid : 'unclaimed'
            return(
              <div className={style.job}>
                <div>{job.id}</div>
                <div>{job.owner_id}</div>
                <div>{claimed_user}</div>
                <div>{created}</div>
                <div>{deadlineDate}</div>
                <div>{deadlineTime}</div>
                <div>{timeLeft}</div>
                <Button 
                  text='download' 
                  onClick={() => dispatch(downloadFile(fileid))}
                />
                <Dropdown>
                  <GoKebabVertical className={style.kebab}/>
                  <Link 
                    className={style.dropdownLink}
                    key={job.id}
                    to={`/viewjob/${job.id}`}
                    state={{ backgroundLocation: location }}
                  >
                    <CgExpand className={style.icon}/>
                    View
                  </Link>
                  <button 
                    className={style.dropdownBtn}
                    onClick={(e)=>handleClickDelete(e, job)}>
                    <MdDeleteForever className={style.icon}/>
                    Delete
                  </button>
                </Dropdown>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ActiveJobsTable