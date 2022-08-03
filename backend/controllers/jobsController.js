const { pool } = require('../config/pool.js')
const {sendToReviewers, sendToTranscribers, sendToPM } = require('../config/discordBot.js')
const { sendEmail } = require('../config/mail.js')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
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
      text: 'SELECT * FROM job WHERE status = $1 AND claimed_userid IS NULL AND active = true ORDER BY "deadline"',
      values: ['transcribe']
    }
  }
  if(role === 'reviewer'){
    getJobsByRoleQuery = {
      text: 'SELECT * FROM job where status = $1 AND claimed_userid IS NULL AND active = true ORDER BY "deadline"',
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
  const results = await pool.query('SELECT * FROM job WHERE active = TRUE ORDER BY "deadline"')
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
  const results = await pool.query('SELECT * FROM job WHERE active = FALSE ORDER BY "deadline" DESC')
  res.status(200).json(results.rows)
}

// 
//  @route    GET /api/job/my
//  @desc     Get all jobs created by the user
//  @access   PRIVATE (all roles)
const getMyJobs = async(req,res) => {
  const { id } = req.user
  const getMyJobsQuery = {
    text: 'SELECT * FROM job WHERE owner_id = $1 ORDER BY "deadline"',
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
    text: 'SELECT * from job where claimed_userid = $1 ORDER BY "deadline"',
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
    text: `SELECT * from job where ${role}_id = $1 ORDER BY "deadline" DESC limit 20`,
    values: [id]
  }
  console.log(getPastJobsQuery.text)
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
    text: 'SELECT name, transcribe_fileid, review_fileid, complete_fileid, owner_id, transcriber_id, reviewer_id FROM job WHERE id = $1 limit 1',
    values: [jobId] 
  }
  const selectJobResult = await pool.query(selectJobQuery)
  let jobName = selectJobResult.rows[0].name
  if (!jobName) {
    jobName = 'Not set.'
  }

  if(!selectJobResult.rows[0]){
    res.status(400)
    throw new Error('job not found')
  }
  const deleteJobQuery = {
    text : "DELETE FROM job WHERE id = $1",
    values: [jobId]
  }
  await pool.query(deleteJobQuery)
  const { transcribe_fileid, review_fileid, complete_fileid, owner_id, name } = selectJobResult.rows[0]
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
          name: 'Name:',
          value: `${jobName}`,
          inline: true
        },{
          name: "Job ID",
          value: jobId,
          inline: true
        }]
    }

    await sendToPM(discordId, deleteJobMessagePM)
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
            name: 'Name:',
            value: `${jobName}`,
            inline: true
        },{
            name: "Job ID",
            value: jobId,
            inline: true
        }]
      }
      await sendToPM(transcriberDiscordId, deleteJobMessagePM)
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
            name: 'Name:',
            value: `${jobName}`,
            inline: true
        },{
            name: "Job ID",
            value: jobId,
            inline: true
        }]
      }
      await sendToPM(reviewerDiscordId, deleteJobMessagePM) 
    }
  }

  const deleteJobMesssageChannel = {
      title: 'Job Deleted.',
      description: `A job has been deleted.`,
      color: 0xDC143C,
      fields: [{
        name: 'Name:',
        value: `${jobName}`,
        inline: true
      },{
        name: 'Job ID:',
        value: `${jobId}`,
        inline: true
      }]
    }

  await sendToTranscribers(deleteJobMesssageChannel)
  await sendToReviewers(deleteJobMesssageChannel)
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
  const {name, file, deadline} = req.body
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
    text: 'INSERT INTO job(transcribe_fileid, owner_id, deadline, name) VALUES ($1, $2, $3, $4) RETURNING id, deadline',
    values: [fileId, id, deadline, name]
  }
  const jobQueryResults = await pool.query(addNewJobQuery)
  const jobId = jobQueryResults.rows[0].id
  let jobName = name;

  //discord notification
  if (!name) {
    jobName = 'Not set.'
  }

  const newJobMessage = {
    title: `New Job for Transcribing!`,
    description: `A new job for transcribing has been posted!\nPlease visit the website to claim it.`,
    color: 0x0099FF,
    fields: [{
      name: 'Name:',
      value: `${jobName}`,
      inline: true
    },{
      name: 'Job ID:',
      value: `${jobId}`,
      inline: true
    },{
      name: 'Creator:',
      value: `${username}`
    },{
      name: 'Deadline:',
      value: `${jobQueryResults.rows[0].deadline}`
    }]
  }

  try {
    await sendToTranscribers(newJobMessage)
  } catch (err) {
    console.log(err)
  }

  // email notification to transcriber
  if (!process.env.NO_EMPLOYEE_EMAIL) {
    const result = await pool.query('SELECT * FROM \"user\" WHERE role = $1', ['transcriber'])
    const transcribers = result.rows

    transcribers.forEach(async (aTranscriber) => {
      if (aTranscriber.toggleemailnotification) {
        const newJobEmail = {
          to_email: aTranscriber.email,
          templateId: 'd-0a4f7d3883174feba09d749c17e2748c',
          subject: "A job needs to be transcribed",
          username: aTranscriber.username,
          targetLink: process.env.FRONTEND_URL
        }
        try {
          await sendEmail(newJobEmail)
        } catch(err){
          console.log(err)
        }
      }
    })
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
  const { role, id, username} = req.user
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
    text: `UPDATE job SET claimed_userid=NULL, ${newStatus}_fileid=$1, ${role}_id= $2, status=$3, active=$4 WHERE id = $5 RETURNING name`,
    values: [newFileId, id, newStatus, newActive, jobId]
  }
  const updateQueryResult = await pool.query(updateJobQuery)

 

  //discord notification
  let jobName = updateQueryResult.rows[0].name
  if (!jobName) {
    jobName = 'Not set.'
  }

  const owner = await pool.query ('SELECT * FROM \"user\" WHERE id = $1', [owner_id])
  const discordNotify = owner.rows[0].togglediscordpm

  if (discordNotify) {
    const discordId = owner.rows[0].discordid

    if(newStatus === 'complete') {

      const completeJobMessagePM = {
        title: `Your job has been completed.`,
        description: `Your job has been completed.\nYou can download the file from the website.`,
        color: 0x57F287,
        fields: [{
          name: 'Name:',
          value: `${jobName}`,
          inline: true
        },{
          name: 'Job Id:',
          value: `${jobId}`,
          inline: true
        },{
          name: 'Filename:',
          value: `${file.name}`
        },{
          name: 'Reviewer:',
          value: `${username}`
        }]
      }

      await sendToPM(discordId, completeJobMessagePM)

    } else {

      const updateJobMessage = {
        title: `Job updated.`,
        description: `Your job with filename, "${file.name}" has been updated from "${status}" to "${newStatus}"!`,
        color: 0x0099FF,
        fields: [{
          name: 'Name:',
          value: `${jobName}`,
          inline: true
        },{
          name: 'Job ID:',
          value: `${jobId}`,
          inline: true
        }, {
          name: `Transcriber:`,
          value: `${username}`
        }, {
          name: 'Status:',
          value: `${newStatus}`
        }]
      }
      await sendToPM(discordId, updateJobMessage)
    }
  }

  if (newStatus === 'review') {
    const reviewStatusMessage = {
      title: `New Job for Reviewing!`,
      description: `A job needs to be reviewed.\nPlease visit the website to review it.`,
      color: 0x0099FF,
      fields: [{
        name: 'Name:',
        value: `${jobName}`,
        inline: true
      },{
        name: 'Job ID:',
        value: `${jobId}`,
        inline: true
      },{
        name: 'Creator:',
        value: `${owner.rows[0].username}`,
        inline: true
      }, {
        name: 'Transcriber:',
        value: `${username}`,
        inline: true
      }, {
        name: 'Deadline:',
        value: `${deadline}`
      }]
    }

    if (newStatus === 'review') {
      try{
        await sendToReviewers(reviewStatusMessage)
      } catch(err){
        console.log(err)
      }
    }
  }

  //email notification to client completion of job

  const ownerEmail = owner.rows[0].email

  if (newStatus === 'complete') {
    const completeJobMessage = {
      to_email: ownerEmail,
      templateId: 'd-fb0a469c70df47d6b97b2cb419205dc8',
      subject: "Your job has been completed",
      username: owner.rows[0].username,
      targetLink: process.env.FRONTEND_URL
      }
      
      try {
        await sendEmail(completeJobMessage)
      } catch(err){
        console.log(err)
      }

  }

  if (newStatus === 'review' && !process.env.NO_EMPLOYEE_EMAIL) {
    // get all reviewers
    const result = await pool.query('SELECT * FROM \"user\" WHERE role = $1', ['reviewer'])
    const reviewers = result.rows

    reviewers.forEach(async (aReviewer) => {
      if (aReviewer.toggleemailnotification) {
        const reviewStatusMessage = {
          to_email: aReviewer.email,
          templateId: 'd-0a4f7d3883174feba09d749c17e2748c',
          subject: "A job needs to be reviewed",
          username: aReviewer.username,
          targetLink: process.env.FRONTEND_URL
        }
        try {
          await sendEmail(reviewStatusMessage)
        } catch(err){
          console.log(err)
        }
      }
    })
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
  const { id, role, username } = req.user
  // need to check status as well
  if(req.user.role === 'client' || req.user.role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const findJobObj = await pool.query('SELECT name, claimed_userid, owner_id, status, active FROM job WHERE id = $1 limit 1', [jobId])
  const job = findJobObj.rows[0]
  if(!job){
    res.status(400)
    throw new Error('job not found')
  }

  let claimableStatus = 'review'
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
    let jobName = job.name
    if (!job.name) {
      jobName = 'Not set.'
    }

    if (discordNotify) {
      const discordId = owner.rows[0].discordid
      const claimJobMessagePM = {
        title: `${username} has claimed your Job.`,
        description: `Your job has been claimed by ${username}.\nPlease contact the ${username} if you have any questions.`,
        color: 0x0099FF,
        fields: [{
          name: 'Name:',
          value: `${jobName}`,
          inline: true
        },{
          name: 'Job ID:',
          value: `${jobId}`,
          inline: true
        }, {
          name: 'Claimed by:',
          value: `${username}`
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
  const { id, username } = req.user
  if(req.user.role === 'client' || req.user.role === 'admin'){
    res.status(401)
    throw new Error('unauthorized access')
  }
  const findJobObj = await pool.query('SELECT name, claimed_userid, owner_id, deadline, status FROM job WHERE id = $1 limit 1', [jobId])
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

    let jobName = job.name
    if (!job.name) {
      jobName = 'Not set.'
    }
    
    if (discordNotify) {
      const discordId = owner.rows[0].discordid
      const dropJobMessagePM = { 
        title: `Your Job has been Dropped.`,
        description: `Your job has been dropped. \nAnother person can claim it.`,
        color: 0xDC143C,
        fields: [{
          name: 'Name:',
          value: `${jobName}`,
          inline: true
        },{
          name: 'Job ID:',
          value: `${jobId}`,
          inline: true
        }, {
          name: 'Dropped by:',
          value: `${username}`
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
        name: 'Name:',
        value: `${jobName}`,
        inline: true
      },{
        name: 'Job ID:',
        value: `${jobId}`,
        inline: true
      },{
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

    if (job.status === 'transcribe') {
      try {
        await sendToTranscribers(dropJobMessageChannel)
      } catch (err) {
        console.log(err)
      }
    } else if (job.status === 'review') {
      try {
        await sendToReviewers(dropJobMessageChannel)
      } catch (err) {
        console.log(err)
      }
    }
  
    res.status(200).json({message: 'job has been successfully dropped'})
  }else{
    res.status(401)
    throw new Error('unauthorized access')
  }
}

//  @route    GET /api/job/one/:id
//  @params   id: id of job obj
//  @desc     drops claimed job of user
//  @access   PRIVATE
const getJob = async(req, res) => {
  const { id: jobId } = req.params
  const { id, role } = req.user
  const getJobQuery = {
    text: 'SELECT * FROM job WHERE id = $1 limit 1',
    values: [jobId]
  }
  const results = await pool.query(getJobQuery) 
  const job = results.rows[0]
  if(!job){
    res.status(400)
    throw new Error('job not found')
  }

  //  preferable to use one postgres query instead of combining results from multiple queries. DO LATER 
  const getTranscribeFileQuery = {
    text: 'SELECT id, name, type, status FROM file WHERE id = $1 limit 1',
    values: [job.transcribe_fileid]
  }

  const getReviewFileQuery = {
    text: 'SELECT id, name, type, status FROM file WHERE id = $1 limit 1',
    values: [job.review_fileid]
  }

  const getCompleteFileQuery = {
    text: 'SELECT id, name, type, status FROM file WHERE id = $1 limit 1',
    values: [job.complete_fileid]
  }

  const getOwnerQuery = {
    text: 'SELECT id, username, email, role FROM \"user\" WHERE id = $1 limit 1',
    values: [job.owner_id]
  }

  const getClaimedUserQuery = {
    text: 'SELECT id, username, email, role FROM \"user\" WHERE id = $1 limit 1',
    values: [job.claimed_userid]
  }

  const transcribeFileResults = await pool.query(getTranscribeFileQuery)
  const reviewFileResults = await pool.query(getReviewFileQuery)
  const completeFileResults = await pool.query(getCompleteFileQuery)
  const ownerQueryResults = await pool.query(getOwnerQuery)
  const claimedUserResults = await pool.query(getClaimedUserQuery)

  job.transcribe_fileid = transcribeFileResults.rows[0] ?  transcribeFileResults.rows[0] : job.transcribe_fileid,
  job.review_fileid = reviewFileResults.rows[0] ? reviewFileResults.rows[0] : job.review_fileid,
  job.complete_fileid = completeFileResults.rows[0] ? completeFileResults.rows[0] : job.complete_fileid,
  job.owner_id = ownerQueryResults.rows[0]
  job.claimed_userid = claimedUserResults.rows[0] ? claimedUserResults.rows[0] : null

  if(role === 'admin' || job.owner_id.id === id || job.transcriber_id === id || job.reviewer_id === id || job.claimed_userid.id === id){
    res.status(200).json(job)
    return
  }
  res.status(401)
  throw new Error('unauthorized access')
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
    getJob,
  }