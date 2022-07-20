import { saveAs } from 'file-saver'

export const downloadFileAsync = async(fileId, token) => {
  try{
    if(!token){
      throw new Error('unauthorized access')
    }
    if(!fileId){
      throw new Error('missing file id')
    }
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
    throw new Error(error)
  }
}