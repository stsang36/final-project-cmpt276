const { pool } = require('../config/pool.js')
const {sendToChannel, sendToPM } = require('../config/discordBot.js')

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

//  @route    DELETE /api/job/admin/delete/:id
//  @desc     Deletes a job and its corresponding files from the database
//  @access   PRIVATE (ADMIN)
const deletejob = async (req,res) => { 
  if(req.user.role !== 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const { id: jobId  } = req.params
  const selectJobQuery = {
    text: 'SELECT transcribe_fileid, review_fileid, complete_fileid, owner_id, transcriber_id, reviewer_id FROM job WHERE id = $1 limit 1',
    values: [jobId] 
  }
  const selectJobResult = await pool.query(selectJobQuery)
  if(!selectJobResult.rows[0]){
    res.status(400)
    throw new Error('job not found')
  }
  const deleteJobQuery = {
    text : "DELETE FROM job WHERE id = $1",
    values: [jobId]
  }
  await pool.query(deleteJobQuery)
  const { transcribe_fileid, review_fileid, complete_fileid, owner_id } = selectJobResult.rows[0]
  const deleteFilesQuery = {
    text: "DELETE FROM file where id IN ($1, $2, $3)",
    values: [transcribe_fileid, review_fileid, complete_fileid]
  }
  await pool.query(deleteFilesQuery)


  // discord notification
  const owner = await pool.query ('SELECT * FROM \"user\" WHERE id = $1', [owner_id])
  const discordNotify = owner.rows[0].togglediscordpm
  
  if (discordNotify) {
    const discordId = owner.rows[0].discordid

    const deleteJobMessagePM = {
      title: `Your job has been deleted by "${req.user.username}".`,
      description: `Your job has been deleted by an administrator.\nPlease contact the administrator if you have any questions.`,
      color: 0xDC143C,
      fields: [{
          name: "Job ID",
          value: jobId
        }]
    }

    try {
      await sendToPM(discordId, deleteJobMessagePM)
    } catch (err) {
      console.log(err)
    }
  }

  if (selectJobResult.rows[0].transcriber_id) {
    const transcriber = await pool.query ('SELECT * FROM \"user\" WHERE id = $1', [selectJobResult.rows[0].transcriber_id])
    const transcriberDiscordNotify = transcriber.rows[0].togglediscordpm

    if (transcriberDiscordNotify) {
      const transcriberDiscordId = transcriber.rows[0].discordid

      const deleteJobMessagePM = {
        title: `Your current job has been deleted by "${req.user.username}".`,
        description: `Your current job has been deleted by an administrator.\nPlease contact the administrator if you have any questions.`,
        color: 0xDC143C,
        fields: [{
            name: "Job ID",
            value: jobId
        }]
      }

      try {
      await sendToPM(transcriberDiscordId, deleteJobMessagePM)
      } catch (err) {
        console.log(err)
      }
    }
  } else if (selectJobResult.rows[0].reviewer_id) {
    const reviewer = await pool.query ('SELECT * FROM \"user\" WHERE id = $1', [selectJobResult.rows[0].reviewer_id])
    const reviewerDiscordNotify = reviewer.rows[0].togglediscordpm
    
    if (reviewerDiscordNotify) {
      const reviewerDiscordId = reviewer.rows[0].discordid

      const deleteJobMessagePM = {
        title: `Your current job has been deleted by "${req.user.username}".`,
        description: `Your current job has been deleted by an administrator.\nPlease contact the administrator if you have any questions.`,
        color: 0xDC143C,
        fields: [{
            name: "Job ID",
            value: jobId
        }]
      }

      try {
      await sendToPM(reviewerDiscordId, deleteJobMessagePM)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const deleteJobMesssageChannel = {
      title: 'Job Deleted.',
      description: `A job has been deleted.`,
      color: 0xDC143C,
      fields: [{
        name: 'Job ID:',
        value: `${jobId}`
      }]
    }
  
  try {
    await sendToChannel(deleteJobMesssageChannel)
  } catch (err) {
    console.log(err)
  }

  


  res.status(200).json({message:`job ${jobId} deleted`})
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
  const {id, username} = req.user
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
    text: 'INSERT INTO job(transcribe_fileid, owner_id, deadline) VALUES ($1, $2, $3) RETURNING id, deadline',
    values: [fileId, id, deadline]
  }
  const jobQueryResults = await pool.query(addNewJobQuery)
  const jobId = jobQueryResults.rows[0].id

  //discord notification

  const newJobMessage = {
    title: `New Job for Transcribing!`,
    description: `A new job for transcribing has been posted!\nPlease visit the website to claim it.`,
    color: 0x0099FF,
    fields: [{
      name: 'Job ID:',
      value: `${jobId}`
    },{
      name: 'Creator:',
      value: `${username}`
    },{
      name: 'Deadline:',
      value: `${jobQueryResults.rows[0].deadline}`
    }]
  }

  try {
    await sendToChannel(newJobMessage)
  } catch (err) {
    console.log(err)
  }

  res.status(200).json({
    message: 'job has been posted', 
    jobId: jobId,
    fileId: fileId,
  })
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
  const { role, id} = req.user
  if(role === 'client' || role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }

  const { id: jobId } = req.params
  var newActive = true
  var newStatus = ''
  const file = req.body
  const findJobResults = await pool.query('SELECT deadline, active, status, claimed_userid, owner_id FROM job WHERE id = $1 limit 1', [jobId])
  const { status, claimed_userid, active, owner_id, deadline } = findJobResults.rows[0]
  if(!active || claimed_userid !== id){
    res.status(401)
    throw new Error('unauthorized access')
  }
  if(status === 'transcribe'){
    if(role === 'reviewer'){
      res.status(401)
      throw new Error('unauthorized access')
    }
    newStatus = 'review'
  }
  if(status === 'review'){
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

  //discord notification

  const owner = await pool.query ('SELECT * FROM \"user\" WHERE id = $1', [owner_id])
  const discordNotify = owner.rows[0].togglediscordpm

  if (discordNotify) {
    const discordId = owner.rows[0].discordid

    if(newStatus === 'complete') {

      const completeJobMessagePM = {
        title: `Your job has been completed by "${req.user.username}".`,
        description: `Your job with ID: ${jobId} "${file.name}" has been completed.\nYou can download the file from the website.`,
        color: 0x57F287
      }

      try {
        await sendToPM(discordId, completeJobMessagePM)
      } catch (err) {
        console.log(err)
      }

    } else {

      const updateJobMessage = {
        title: `Job updated.`,
        description: `Your job with filename, "${file.name}" has been updated from "${status}" to "${newStatus}"!`,
        color: 0x0099FF,
        fields: [{
          name: 'Job ID:',
          value: `${jobId}`
        }, {
          name: `Worker:`,
          value: `${req.user.username}`
        }, {
          name: 'Status:',
          value: `${newStatus}`
        }]
      }

      try {
        await sendToPM(discordId, updateJobMessage)
      } catch (err) {
        console.log(err)
      }

    }
  }

  if (newStatus === 'review') {
    const reviewStatusMessage = {
      title: `New Job for Reviewing!`,
      description: `A job needs to be reviewed.\nPlease visit the website to review it.`,
      color: 0x0099FF,
      fields: [{
        name: 'Job ID:',
        value: `${jobId}`
      }, {
        name: 'Creator:',
        value: `${owner.rows[0].username}`,
        inline: true
      }, {
        name: 'Transcriber:',
        value: `${req.user.username}`,
        inline: true
      }, {
        name: 'Deadline:',
        value: `${deadline}`
      }]
    }

    try {
      await sendToChannel(reviewStatusMessage)
    } catch (err) {
      console.log(err)
    }

  }

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
  const findJobObj = await pool.query('SELECT claimed_userid, owner_id, status, active FROM job WHERE id = $1 limit 1', [jobId])
  const job = findJobObj.rows[0]
  if(!job){
    res.status(400)
    throw new Error('job not found')
  }

  let  claimableStatus = 'review'
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

    //discord notification
    const owner_id = job.owner_id
    const owner = await pool.query ('SELECT * FROM \"user\" WHERE id = $1', [owner_id])
    const discordNotify = owner.rows[0].togglediscordpm

    if (discordNotify) {
      const discordId = owner.rows[0].discordid
      const claimJobMessagePM = {
        title: `${req.user.username} has Claimed your Job.`,
        description: `Your job has been claimed by ${req.user.username}.\nPlease contact the ${req.user.username} if you have any questions.`,
        color: 0x0099FF,
        fields: [{
          name: 'Job ID:',
          value: `${jobId}`
        }, {
          name: 'Claimed by:',
          value: `${req.user.username}`
        }, {
          name: 'Status:',
          value: `${job.status}`
        }]
      }
      try {
        await sendToPM(discordId, claimJobMessagePM)
      } catch (err) {
        console.log(err)
      }
    }
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
  const findJobObj = await pool.query('SELECT claimed_userid, owner_id, deadline, status FROM job WHERE id = $1 limit 1', [jobId])
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

    // discord notification
    const owner_id = job.owner_id
    const owner = await pool.query ('SELECT * FROM \"user\" WHERE id = $1', [owner_id])
    const discordNotify = owner.rows[0].togglediscordpm
    const ownerUsername = owner.rows[0].username
    
    if (discordNotify) {
      const discordId = owner.rows[0].discordid
      const dropJobMessagePM = { 
        title: `Your Job has been Dropped.`,
        description: `Your job has been dropped. \nAnother person can claim it.`,
        color: 0xDC143C,
        fields: [{
          name: 'Job ID:',
          value: `${jobId}`
        }, {
          name: 'Dropped by:',
          value: `${req.user.username}`
        }]
      }

      try {
        await sendToPM(discordId, dropJobMessagePM)
      } catch (err) {
        console.log(err)
      }
    }
    
    const dropJobMessageChannel = {
      title: `Available Job!`,
      description: `A job from "${ownerUsername}" is available to be claimed!\nPlease visit the website to claim it.`,
      color: 0x0099FF,
      fields: [{
        name: 'Job ID:',
        value: `${jobId}`
      }, {
        name: 'Creator:',
        value: `${ownerUsername}`,
        inline: true
      }, {
        name: 'Status:',
        value: `Need to ${job.status}`,
        inline: true
      }, {
        name: 'Deadline:',
        value: `${job.deadline}`
      }]
    }

    try {
      await sendToChannel(dropJobMessageChannel)
    } catch (err) {
      console.log(err)
    }
      
  
    
  
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