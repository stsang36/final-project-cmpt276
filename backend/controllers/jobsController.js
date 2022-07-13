const { pool } = require('../config/pool.js')
require('express-async-errors')

//
//  @route    GET /api/job
//  @desc     Get all available jobs by role
//  @access   PRIVATE (transcriber and reviewer)
const getAvailableJobs = async (req, res) => {
  const { role } = req.user
  if(role === 'client' || role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  let getJobsByRoleQuery = {
    text: '',
    values: []
  }
  if(role === 'transcriber'){
    getJobsByRoleQuery = {
      text: 'SELECT * FROM job WHERE status = $1 AND claimed_userid IS NULL',
      values: ['transcribe']
    }
  }
  if(role === 'reviewer'){
    getJobsByRoleQuery = {
      text: 'SELECT * FROM job where status = $1 AND claimed_userid IS NULL',
      values: ['review']
    }
  }
  const result = await pool.query(getJobsByRoleQuery)
  res.status(200).json(result.rows)
}
//  @route    GET /api/job/admin/active
//  @desc     Gets all active jobs
//  @access   PRIVATE (admin only)
const getAllActiveJobs = async(req, res) => {
  if(req.user.role !== 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const results = await pool.query('SELECT * FROM job WHERE active = TRUE')
  res.status(200).json(results.rows)
}

//  @route    GET /api/job/admin/inactive
//  @desc     Gets all inactive jobs
//  @access   PRIVATE (admin only)
const getAllInactiveJobs = async(req, res) => {
  if(req.user.role !== 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const results = await pool.query('SELECT * FROM job WHERE active = FALSE')
  res.status(200).json(results.rows)
}

// 
//  @route    GET /api/job/my
//  @desc     Get all jobs created by the user
//  @access   PRIVATE (all roles)
const getMyJobs = async(req,res) => {
  const { id } = req.user
  const getMyJobsQuery = {
    text: 'SELECT * FROM job WHERE owner_id = $1',
    values: [id]
  }
  const result = await pool.query(getMyJobsQuery)
  res.status(200).json(result.rows)
}

// 
//  @route    GET /api/job/current
//  @desc     Get all ongoing jobs claimed by user
//  @access   PRIVATE (roles: reviewers, transcribers)
const getCurrentJobs = async(req, res) => {
  if(req.user.role === 'client' || req.user.role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const { id } = req.user
  const getCurrentJobsQuery = {
    text: 'SELECT * from job where claimed_userid = $1',
    values: [id]
  }
  const result = await pool.query(getCurrentJobsQuery)
  res.status(200).json(result.rows)
}

//  @route    GET /api/job/past
//  @desc     Get all past jobs completed by user
//  @access   PRIVATE (roles: reviewers, transcribers)
const getPastJobs = async(req, res) => {
  const { role } = req.user
  if(role === 'client' || role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const { id } = req.user
  const getPastJobsQuery = {
    text: `SELECT * from job where ${role}_id = $1 AND claimed_userid != $1`,
    values: [id]
  }
  const result = await pool.query(getPastJobsQuery)
  res.status(200).json(result.rows)
}

//  @route    DELETE /api/job/delete/:id
//  @desc     Deletes a job and its corresponding files from the database
//  @access   PRIVATE (ADMIN)
const deletejob = async (req,res) => { 
  if(req.user.role !== 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const { id: jobId  } = req.params.id
  const selectJobQuery = {
    text: 'SELECT transcribe_fileid, review_fileid, complete_fileid FROM job WHERE id = $1 limit 1',
    values: [jobId] 
  }
  const selectJobResult = await pool.query(selectJobQuery)
  const { transcribe_fileid, review_fileid, complete_fileid } = selectJobResult.rows[0]
  const deleteFilesQuery = {
    text: "DELETE FROM file where id IN ($1, $2, $3)",
    values: [transcribe_fileid, review_fileid, complete_fileid]
  }
  await pool.query(deleteFilesQuery)
  const deleteJobQuery = {
    text : "DELETE FROM job WHERE id = $1",
    values: [jobId]
  }
  await pool.query(deleteJobQuery)
  res.status(200).json({message:"Delete request called"})
}

// 
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

// 
//  @route    PUT /api/job/update/:id
//  @params   id: id of job obj
//  @body     Obj: w/ new file obj
//  @desc     Uploads a new job to the database
//  @access   PRIVATE
const updateJob = async(req, res) => {
  if(!req.body){
    res.status(400)
    throw new Error('missing body')
  }
  if(!req.params.id){
    res.status(400)
    throw new Error('missing parameter')
  }
  const { role, id } = req.user
  if(role === 'client' || role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }

  const { id: jobId } = req.params
  var newActive = true
  var newStatus = ''
  const file = req.body
  const findJobResults = await pool.query('SELECT status FROM job WHERE id = $1 limit 1', [jobId])
  const currentStatus = findJobResults.rows[0].status
  if(currentStatus === 'transcribe'){
    if(role === 'reviewer'){
      res.status(401)
      throw new Error('unauthorized access')
    }
    newStatus = 'review'
  }
  if(currentStatus === 'review'){
    if(role === 'transcriber'){
      res.status(401)
      throw new Error('unauthorized access')
    }
    newStatus = 'complete'
    newActive = false
  }

  //  upload file into database
  const buf = Buffer.from(file.media, 'base64')
  const uploadFileQuery = {
    text: 'INSERT INTO file(name, type, media, status) VALUES ($1, $2, $3, $4) RETURNING id',
    values: [file.name, file.type, buf, newStatus]
  }
  const fileUploadResults  = await pool.query(uploadFileQuery)
  const newFileId = fileUploadResults.rows[0].id
  const updateJobQuery = {
    text: `UPDATE job SET claimed_userid=NULL, ${newStatus}_fileid=$1, ${role}_id= $2, status=$3, active=$4 WHERE id = $5`,
    values: [newFileId, id, newStatus, newActive, jobId]
  }
  await pool.query(updateJobQuery)
  res.status(200).json({message: 'success'})
}

// 
//  @route    PUT /api/job/claim/:id
//  @params   id: id of job obj
//  @desc     claims job for user
//  @access   PRIVATE
const claimJob = async(req, res) => {
  const { id: jobId } = req.params
  const { id, role } = req.user
  // need to check status as well
  if(req.user.role === 'client' || req.user.role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const findJobObj = await pool.query('SELECT claimed_userid, status, active FROM job WHERE id = $1 limit 1', [jobId])
  const job = findJobObj.rows[0]
  if(!job){
    res.status(400)
    throw new Error('job not found')
  }

  var claimableStatus = 'review'
  if(role === 'transcriber'){
    claimableStatus = 'transcribe'
  }

  if(!job.active || job.status !== claimableStatus){
    res.status(401)
    throw new Error('unauthorized access')
  }
  if(!job.claimed_userid){
    const claimJobQuery = {
      text: 'UPDATE job SET claimed_userid=$1 WHERE id = $2',
      values: [id, jobId]
    }
    await pool.query(claimJobQuery)
    res.status(200).json({message: 'job has been claimed successfully'})
  }else{
    res.status(400)
    throw new Error('job has already been claimed')
  }
}

// 
//  @route    PUT /api/job/drop/:id
//  @params   id: id of job obj
//  @desc     drops claimed job of user
//  @access   PRIVATE
const dropJob = async(req, res) => {
  const { id: jobId } = req.params
  const { id } = req.user
  if(req.user.role === 'client' || req.user.role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const findJobObj = await pool.query('SELECT claimed_userid FROM job WHERE id = $1 limit 1', [jobId])
  const job = findJobObj.rows[0]
  if(!job){
    res.status(400)
    throw new Error('job not found')
  }
  if(job.claimed_userid === id){
    const claimJobQuery = {
      text: 'UPDATE job SET claimed_userid=$1 WHERE id = $2',
      values: [null, jobId]
    }
    await pool.query(claimJobQuery)
    res.status(200).json({message: 'job has been successfully dropped'})
  }else{
    res.status(401)
    throw new Error('unauthorized access')
  }
}

module.exports = { 
    getAvailableJobs,
    getCurrentJobs,
    getPastJobs,
    getMyJobs,
    deletejob,
    addJob,
    updateJob,
    claimJob,
    dropJob,
    getAllActiveJobs,
    getAllInactiveJobs,
  }