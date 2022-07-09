const { pool } = require('../config/pool.js')
require('express-async-errors')

const getAllJobs = (req,res)=>{
  const results = await pool.query('SELECT * FROM job')
  res.status(200).json(results.rows)
}

const deletejob = async (req,res)=>{
  const jobId = req.params.id
  const deleteUserQuery = {
      text : "delete from job where id =$1",
      values: [id]
  }
  await pool.query(deleteUserQuery)
  res.status(200).json({message:"Delete request called"})
    
}

//  @route    POST /api/job
//  @body     Job obj w/ fields file, deadline
//  @desc     Uploads a new job to the database
//  @access   PRIVATE
const addJob = async(req, res) => {
  if(!req.body){
    res.status(400)
    throw new Error('missing data')
  }
  const {id} = req.user
  const {file, deadline} = req.body
  const buf = Buffer.from(file.media, 'base64')
  const uploadFileQuery = {
    text: 'INSERT INTO file(name, type, media) VALUES ($1, $2, $3) RETURNING id',
    values: [file.name, file.type, buf]
  }
  const fileUploadResults  = await pool.query(uploadFileQuery)
  if(!fileUploadResults.rows[0]){
    res.status(400)
    throw new Error('File upload failed')
  }
  const fileId = fileUploadResults.rows[0].id
  const addNewJobQuery = {
    text: 'INSERT INTO job(transcribe_fileid, owner_id, deadline) VALUES ($1, $2, $3)',
    values: [fileId, id, deadline]
  }
  await pool.query(addNewJobQuery)
  res.status(200).json({message: 'job has been posted'})
}

module.exports = { 
    getAllJobs,
    deletejob,
    addJob,
  }