export const getFilesSize = (files) => {
  var totalSize = 0
  for(var i = 0; i < files.length; i++){
    totalSize = totalSize + files[i].size
  }
  return totalSize
}