import {
  BsFileEarmarkZipFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkCodeFill,
  BsFileEarmarkRichtextFill,
  BsFileEarmarkPptFill,
  BsFileEarmarkPdfFill,
  BsFileEarmarkTextFill,
  BsFileEarmarkFill
} from 'react-icons/bs'

const FileIcon = ({mimeType, className}) => {
  if(mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword'){
    return <BsFileEarmarkWordFill className={className}/>
  }
  if(mimeType === 'text/html'){
    return <BsFileEarmarkCodeFill className={className}/>
  }
  if(mimeType === 'application/rtf'){
    return <BsFileEarmarkRichtextFill className={className}/>
  }
  if(mimeType === 'application/pdf'){
    return <BsFileEarmarkPdfFill className={className}/> 
  }
  if(mimeType === 'application/vnd.ms-powerpoint' || mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
    return <BsFileEarmarkPptFill className={className}/>
  }
  if(mimeType === 'application/zip'){
    return <BsFileEarmarkZipFill className={className}/>
  }
  if(mimeType === 'text/markdown' || mimeType === 'text/plain'){
    return <BsFileEarmarkTextFill className={className}/>
  }
  return <BsFileEarmarkFill className={className}/>
}

export default FileIcon