import style from './style.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useDropJobMutation, useGetJobQuery } from 'redux/slices/jobSlice'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import Button from 'common/components/Button'
import { downloadFile } from 'redux/slices/fileSlice'
import { BiLoader, BiTimeFive, BiTimer, BiWrench, BiCoffee } from 'react-icons/bi'
import { AiFillAlert, AiFillEye } from 'react-icons/ai'
import { MdCreateNewFolder, MdDownloadForOffline } from 'react-icons/md'
import { BsFillPersonFill, BsInfoCircleFill } from 'react-icons/bs'
import { IoNewspaper } from 'react-icons/io5'
import FileIcon from '../../../../common/components/FileIcon'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ActivityStatus from 'common/components/ActivityStatus'
import JobStatus from 'common/components/JobStatus'
import { fileButtonVariants } from '../utils/variants'
import { calculateTimeLeft } from 'common/utils/calculateTimeLeft'
import Protect from 'common/components/Protect'



const JobContainer = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useGetJobQuery({id}, {refetchOnMountOrArgChange: true})
  const [ dropJob, dropResults ] = useDropJobMutation()
  const { user: { role, id: userId } } = useSelector(state => state.auth)

  useEffect(() => {
    document.title = `Bytetools | Viewing Job ${data ? data.name : ''}`
    return () => document.title = 'Bytetools'
  },[])

  useEffect(() => {
    const { isSuccess, isError, error, reset } = dropResults
    if(isSuccess){
      toast.success('Dropped Job')
      navigate('/dashboard')
      return
    }
    if(isError){
      console.log('here')
      toast.error(`An error occured: ${error.message}`)
      reset()
      return
    }
  },[dropResults])

  return (
    <Protect>
      <motion.main className={style.main}>
        <header>
          <h1 className={style.pageHeading}>Viewing Job</h1>
        </header>
        {data && (
          <section className={style.container}>
            <section className={style.infoContainer}>
              <h1 className={style.jobName}>
                {data.name}
                <ActivityStatus active={data.active} />
              </h1>
              <ul className={style.ul}>
                <li className={style.li}>
                  <p>
                    <BsInfoCircleFill className={style.icon}/>
                    ID
                  </p>
                  <p>{data.id}</p>
                </li>
                <li className={style.li}>
                  <p>
                    <BiLoader className={style.icon}/>
                    Status
                  </p>
                  <JobStatus status={data.status}/>
                </li>
                <li className={style.li}>
                  <p>
                    <AiFillAlert className={style.icon}/>
                    Deadline Date
                  </p>
                  <p>{moment(data.deadline).format('MMMM DD, YYYY')}</p>
                </li>
                <li className={style.li}>
                  <p>
                    <BiTimeFive className={style.icon}/>
                    Deadline Time
                  </p>
                  <p>{moment(data.deadline).format('h:mma')}</p>
                </li>
                <li className={style.li}>
                  <p>
                    <BiTimer className={style.icon}/>
                    Time Left
                  </p>
                  <p>{calculateTimeLeft(moment(data.deadline)) ? calculateTimeLeft(moment(data.deadline)) : 'Past Deadline'}</p>
                </li>
                <li className={style.li}>
                  <p>
                    <BiWrench className={style.icon}/>
                    Claimed By
                  </p>
                  {data.claimed_userid && (data.claimed_userid.id === userId) ? (
                    <p>You</p>
                  ) : (
                    <p>{data.claimed_userid ? data.claimed_userid.username : 'unclaimed'}</p>
                  )}
                </li>
                <li className={style.li}>
                  <p>
                    <MdCreateNewFolder className={style.icon}/>
                    Created
                  </p>
                  <p>{moment(data.created_at).fromNow()}</p>
                </li>
                <li className={style.li}>
                  <p>
                    <BsFillPersonFill className={style.icon}/>
                    Owner
                  </p>
                  {data.owner_id.id === userId ? (
                    <p>You</p>
                  ) : (
                    <p>{data.owner_id.username}</p>
                  )}
                </li>
              </ul>
            </section>
            <section className={style.filesContainer}>
              <h1 className={style.filesH1}>Download Files</h1>
              <ul className={style.fileList}>
                <li>
                  <p className={style.jobStatus}>
                    <IoNewspaper className={style.icon}/>
                    Transcribing File
                  </p>
                  <motion.button
                    className={style.fileBtn}
                    onClick={()=>dispatch(downloadFile(data.transcribe_fileid.id))}
                    disabled={!data.transcribe_fileid || role === 'reviewer'}
                    custom={!data.transcribe_fileid || role === 'reviewer'}
                    variants={fileButtonVariants}
                    whileHover='hover'
                    whileTap='tap'
                  >
                    {data.transcribe_fileid && role !== 'reviewer' && ( 
                      <>
                        <FileIcon mimeType={data.transcribe_fileid.type} className={style.fileIcon}/>
                        <p className={style.fileName}>{data.transcribe_fileid.name && data.transcribe_fileid.name}</p>
                        <MdDownloadForOffline className={style.downloadIcon}/>
                      </>
                    )}
                    {data.transcribe_fileid && role === 'reviewer' && (
                      <p>Sorry, you do not have access to this file.</p>
                    )}
                    {!data.transcribe_fileid && (
                      <p>File have not been uploaded yet.</p>
                    )}
                  </motion.button>
                </li>
                <li>
                  <p className={style.jobStatus}>
                    <AiFillEye className={style.icon}/>
                    Reviewing File
                  </p>
                  <motion.button
                    className={style.fileBtn}
                    onClick={()=>dispatch(downloadFile(data.review_fileid.id))}
                    disabled={!data.review_fileid || role === 'client'}
                    custom={!data.review_fileid || role === 'reviewer'}
                    variants={fileButtonVariants}
                    whileHover='hover'
                    whileTap='tap'
                  >
                    {data.review_fileid && role !== 'client' && (
                      <>
                        <FileIcon mimeType={data.review_fileid.type} className={style.fileIcon}/>
                        <p className={style.fileName}>{data.review_fileid.name}</p>
                        <MdDownloadForOffline className={style.downloadIcon}/>
                      </>
                    )}
                    {data.review_fileid && role === 'client' && (
                      <p>Sorry, you do not have access to this file.</p>
                    )}
                    {!data.review_fileid && (
                      <p>File have not been uploaded yet.</p>
                    )}
                  </motion.button>
                </li>
                <li>
                  <p className={style.jobStatus}>
                    <BiCoffee className={style.icon}/>
                    Completed File
                  </p>
                  <motion.button
                    className={style.fileBtn}
                    onClick={()=>dispatch(downloadFile(data.complete_fileid.id))}
                    disabled={!data.complete_fileid || role === 'transcriber'}
                    custom={!data.complete_fileid || role === 'reviewer'}
                    variants={fileButtonVariants}
                    whileHover='hover'
                    whileTap='tap'
                  >
                    {data.complete_fileid && role !== 'transcriber' && (
                      <>
                        <FileIcon mimeType={data.complete_fileid.type} className={style.fileIcon}/>
                        <p className={style.fileName}>{data.complete_fileid.name}</p>
                        <MdDownloadForOffline className={style.downloadIcon}/>
                      </>
                    )}
                    {data.complete_fileid && role === 'transcriber' && (
                      <p>Sorry, you do not have access to this file.</p>
                    )}
                    {!data.complete_fileid && (
                      <p>File have not been uploaded yet.</p>
                    )}
                  </motion.button>
                </li>
              </ul>
            {data.claimed_userid && data.claimed_userid.id === userId && (
              <Button 
                text='Drop Job'
                className={style.dropBtn}
                onClick={()=>dropJob({id})}
              />
            )}
            </section>
          </section>
        )}
      </motion.main>
    </Protect>
  )
}

export default JobContainer