const {
    pool
} = require('../config/pool.js')
const stream = require('stream')
require('express-async-errors')

const uploadFile = async (req, res) => {

    try {
        const file = req.body.file
        const fileName = req.body.fileName
        const fileExt = req.body.fileType
        const fileStatus = req.body.fileStatus

        const newFile = file.toString('base64')
        const newBuf = Buffer.from(newFile, 'base64')
        const myDate = new Date(Date.now()).toISOString();
        const query = {
            text: 'INSERT into file(name, type, status, created_At, media) VALUES ($1, $2, $3, $4, $5)',
            values: [fileName, fileExt, fileStatus, myDate, newBuf]
        }
        await pool.query(query)
        res.status(200).send('File uploaded successfully, great success!')
    } catch (error) {
        console.log(error)
        res.status(400).send(`${error}`)
    }
}

const deleteFile = async (req, res) => {
    try {
        const fileId = req.body.fileId;
        const role = req.body.role;

        if (role !== 'admin') {
            throw new Error('Not Authorized')
        }

        query = {
            text: 'SELECT * FROM file WHERE id = $1',
            values: [fileId]
        }

        fileResult = await pool.query(query)

        if (fileResult.rows.length === 0) {
            throw new Error('File not found')
        }

        query = {
            text: 'DELETE FROM file WHERE id = $1',
            values: [fileId]
        }

        await pool.query(query)

        res.status(200).send(`ID: ${fileId} ${fileResult.rows[0].name}.${fileResult.rows[0].type} deleted.`)
    } catch (error) {
        console.log(error)
        res.status(400).send(`${error}`)
    }
}

const getFile = async (req, res) => {
    try {
        const fileId = req.query.fileId;

        const getDataQuery = {
            text: 'SELECT * FROM file WHERE id = $1',
            values: [fileId]
        }

        const data = await pool.query(getDataQuery)

        if (data.rows.length === 0) {
            throw new Error('File not found')
        }

        // pipe donwload automtically, and redirects to previous path
        const fileType = data.rows[0].type
        const fileName = data.rows[0].name;
        const fileContent = data.rows[0].media;

        // convert buffer to string base64, would be the content the server recieves
        const newContent = fileContent.toString('base64');
        // convert string to a buffer in order to be served to client for download
        const newBuf = Buffer.from(newContent, 'base64')
        let readStream = new stream.PassThrough()
        readStream.end(newBuf)
        res.set('content-disposition', `attachment; filename=${fileName}.${fileType}`);
        // set content type accordingly
        res.set('content-type', `application/${fileType}`)
        readStream.pipe(res)
        res.status(200)
    } catch (error) {
        console.log(error);
        res.status(400).send(`${error}`)
    }
}


module.exports = {
    uploadFile,
    deleteFile,
    getFile
}