import style from './style.module.css'
import Button from 'common/components/Button'
import { useRef, useState, useEffect } from 'react'
import { AiOutlineFile, AiOutlineCloudUpload } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'
import { formatBytes } from '../../../pages/create/utils/formatBytes'
import { getFilesSize } from 'pages/create/utils/getFilesSize'
import { toast } from 'react-toastify'
import JSZip from 'jszip'
import { Buffer } from 'buffer'
import FileIcon from '../FileIcon'

const generateAcceptedExtStr = (extensionsArray) => {
  var string = ''
  for(let i = 0; i < extensionsArray.length; i++){
    string = string + '.' + extensionsArray[i] + ','
  }
  return string
}

const FileInput = ({className, supportedExtensions, setSubmitFile, maxFiles, maxSize = 52428800, setDisableSubmit, status}) => {
  const inputFile = useRef(null)
  const [files, setFiles]= useState([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleChange = (event) => {
    [...event.target.files].map(file => {
      const extension = file.name.split('.').pop()
      if(supportedExtensions.includes(extension)){
        setFiles(prev => [...prev, file])
      }else{
        toast.error(`unsupported file extension for ${file.name}`)
      }
    })
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const e = {
      target: {
        files: []
      }
    }
    if(event.dataTransfer.items){
      for(var i = 0; i < event.dataTransfer.items.length; i++){
        if(event.dataTransfer.items[i].kind === 'file'){
          const file = event.dataTransfer.items[i].getAsFile()
          e.target.files.push(file)
        }
      }
    }else{
      e.target.files = event.dataTransfer.files
    }
    setIsDragOver(false)
    handleChange(e)
  }

  const handleOnDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleOnDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  const handleOnDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if(event.currentTarget.contains(event.relatedTarget)) return;
    setIsDragOver(false)
  }

  const onButtonClick = (e) => {
    e.preventDefault()
    inputFile.current.click()
  }

  const handleDeleteFile = (e, index) => {
    e.preventDefault()
    setFiles(prev => prev.filter((file, idx) => idx !== index))
  }

  useEffect(()=>{
    const encodeSingleFile = async(file) => {
      const arrBuf = await file.arrayBuffer()
      const buf = Buffer.from(arrBuf, 'base64')
      const base64str = buf.toString('base64')
      setSubmitFile({
        name: file.name,
        media: base64str,
        type: file.type,
        status: status
      })
    }

    if(files.length > maxFiles){
      setDisableSubmit(true)
      toast.warn(`You have exceeded the maximum number of files: ${maxFiles}`)
      return
    }
    if(files.length === maxFiles){
      toast.warn(`You have reached the maximum number of files: ${maxFiles}`)
      return
    }
    if(getFilesSize(files) > maxSize){
      setDisableSubmit(true)
      toast.warn(`You have exceeded the maximum size of files: ${formatBytes(maxSize)}`)
      return
    }
    setDisableSubmit(false)

    if(files.length > 1){
      const zip = new JSZip()
      for(var i = 0; i < files.length; i++){
        zip.file(files[i].name, files[i])
      }
      zip.generateAsync({type: 'base64'}).then(function(base64str) {
        setSubmitFile({
          name: `bytetools_${status}.zip`,
          media: base64str,
          type: 'application/zip',
          status: status
        })
      })
      return
    }
    if(files.length === 1){
      encodeSingleFile(files[0])
      return
    }
  },[files, maxFiles, maxSize])

  return (
    <>
      <input 
        ref={inputFile}
        type='file' 
        className={style.hide}
        accept={generateAcceptedExtStr(supportedExtensions)}
        onChange={handleChange}
        multiple={maxFiles > 1}
      />
      <div 
        aria-hidden={true}
        className={`${style.fileInput} ${className}`}
        onDrop={handleDrop}
        onDragOver={handleOnDragOver}
        onDragEnter={handleOnDragEnter}
        onDragLeave={handleOnDragLeave}
      >
        {isDragOver && 
          <div className={style.dropZoneHover}>
            <h1>Drop Here</h1>
          </div>
        }
        {files.length === 0 && 
        <div className={style.dropzone}>
          <AiOutlineCloudUpload className={style.uploadIcon}/>
          <div className={style.dropzoneMsg}>Drag {'&'} Drop to Upload File{maxFiles > 1 ? 's' : ''}</div>
        </div>}
        {files.map((file, index) => (
          <div className={style.file} key={index}>
            <FileIcon className={style.fileIcon} mimeType={file.type}/>
            <div className={style.fileName}>{file.name}</div>
            <div className={style.fileSize}>{formatBytes(file.size)}</div>
            <button 
              className={style.fileDeleteIcon}
              onClick={(e)=>handleDeleteFile(e, index)}
            >
              <IoClose />
            </button>
          </div>
        ))}
        <div className={style.filesInfo}>
          {files.length > 1 && <div>Files will be compressed into a zip file</div>}
          {files.length > 0 && <div>Total Size: {formatBytes(getFilesSize(files))}</div>}
          {files.length > maxFiles && <div>You have exceeded the max. number of files: {maxFiles}</div>}
          {getFilesSize(files) > maxSize &&  <div>You have exceeded the max. size of files: {formatBytes(maxSize)}</div>}
        </div>
        <Button 
          className={style.selectFilesBtn}
          text={`Select File${maxFiles > 1 ? 's' : ''}`} 
          onClick={onButtonClick}
          disabled={files.length >= maxFiles || getFilesSize(files) >= maxSize}
        />
      </div>
    </>
  )
}

export default FileInput