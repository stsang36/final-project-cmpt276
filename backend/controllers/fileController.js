const { pool } = require('../config/pool.js')
const stream = require('stream')
require('express-async-errors')

// @route:  POST /api/file
// @desc:   uploads a new file to 'file' table
// @body:   obj w/ file, fileName, fileType, and fileStatus
// @access: PRIVATE
const uploadFile = async (req, res) => {

    const file = req.body.file
    const fileName = req.body.fileName
    const fileType = req.body.fileType
    const fileStatus = req.body.fileStatus

    if (!file || !fileName || !fileType || !fileStatus) {
        res.status(400)
        throw new Error('File upload failed, missing required fields')
    }

    const newFile = file.toString('base64')
    const newBuf = Buffer.from(newFile, 'base64')
    const insertQuery = {
        text: 'INSERT into file(name, type, status, media) VALUES ($1, $2, $3, $4) RETURNING id',
        values: [fileName, fileType, fileStatus, newBuf]
    }
    const inserted = await pool.query(insertQuery)
    
    res.status(200).send({
        'message': 'File uploaded successfully',
        'fileId': inserted.rows[0].id
    })

    return
}

// @route:  DELETE /api/file
// @desc:   deletes file from the 'file' table
// @body:   obj w/ fileID, role
// @access: PRIVATE (ADMIN ONLY)
const deleteFile = async (req, res) => {

    const fileId = req.body.fileId;
    const role = req.user.role;

    if (role !== 'admin') {
        res.status(401)
        throw new Error('You are not authorized to delete files')
    }

    const findQuery = {
        text: 'SELECT * FROM file WHERE id = $1',
        values: [fileId]
    }

    fileResult = await pool.query(findQuery)

    if (fileResult.rows.length === 0) { 
        res.status(404)
        throw new Error(`File with id ${fileId} not found`)
    }

    const deleteQuery = {
        text: 'DELETE FROM file WHERE id = $1',
        values: [fileId]
    }

    await pool.query(deleteQuery)

    res.status(200).send({
        'message':`ID: ${fileId} deleted successfuly.`,
        'fileId': fileId
    })

    return
}

// @route:  GET /api/file/:id
// @desc:   retrieves a file from the 'file' table
// @body:   obj w/ id (fileID)
// @access: PRIVATE (Employees ONLY)
const getFile = async (req, res) => {
    const fileId = req.params['id']; //id should be fileID

    const getDataQuery = {
        text: 'SELECT * FROM file WHERE id = $1',
        values: [fileId]
    }

    const data = await pool.query(getDataQuery)

    if (data.rows.length === 0) {
        res.status(404)
        throw new Error(`File with id ${fileId} not found`)
    }

    // pipe donwload automtically, and redirects to previous path
    const fileType = data.rows[0].type
    const fileName = data.rows[0].name;
    const fileContent = data.rows[0].media;

    // convert buffer to string base64, would be the content the server recieves
    // const newContent = fileContent.toString('base64');
    // convert string to a buffer in order to be served to client for download
    // const newBuf = Buffer.from(newContent, 'base64')
    let readStream = new stream.PassThrough()
    readStream.end(fileContent)
    res.set('content-disposition', `attachment; filename=${fileName}`);
    // set content type accordingly
    res.set('content-type', `${fileType}`)
    res.set('Access-Control-Expose-Headers', 'Content-Disposition')
    readStream.pipe(res);

    res.status(200)
    
    return;
}


module.exports = {
    uploadFile,
    deleteFile,
    getFile
}