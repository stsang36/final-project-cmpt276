import { toast } from 'react-toastify'
import { saveAs } from 'file-saver'

export const downloadFile = async(fileId, token) => {
  if(!token || !fileId){
    toast.error('No access')
    return 
  }
  try{
    // const res = await fetch(`http://localhost:5000/api/file/${fileId}`, {
    const res = await fetch(`/api/file/${fileId}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
    const blob = await res.blob()
    const header =  res.headers.get('content-disposition')
    const parts = header.split(';')
    const filename = parts[1].split('=')[1]
    saveAs(blob, filename)
    return
  }catch(error){
    toast.error(`An error occcured: ${error.message}`)
  }
}