const express = require('express')
const fs = require('fs')
const path = require('path')
const stream = require('stream')
const multer = require('multer')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const { Pool } = require('pg')

const app = express()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.post('/upload', async(req, res) => {

    console.log("uploading file to db...")
  try{
    // postgres automatically saves as hex
    const myfile = "sample.pdf"
    const file = await fs.promises.readFile('./${myfile}');
    
    // server req.body would be in this format
    const fileName = path.parse(myfile).name;
    const fileExt = path.parse(myfile).ext;
    const newFile = file.toString('base64')
    const myDate = new Date(Date.now()).toISOString();
    const query = {
      text: 'INSERT into file(name, type, status, created_At, media) VALUES ($1, $2, $3, $4, $5)',
      values: [fileName, fileExt, 'uploaded', myDate, newBuf]
    }
    //console.log(fileName, fileExt, 'uploaded', myDate, newBuf);
    await pool.query(query)
    res.status(200).send('Great Success')
  }catch(error){
    res.status(400).send(error)
  }
})

app.post('/delete', async (req, res) => {

});

app.get('/files', async(req, res) => {
  try{
    const getDataQuery = 'SELECT * FROM file'
    const data = await pool.query(getDataQuery)
    // pipe donwload automtically, and redirects to previous path
    const fileContent = data.rows[0].media;
    // convert buffer to string base64, would be the content the server recieves
    const newContent = fileContent.toString('base64');
    // convert string to a buffer in order to be served to client for download
    const newBuf = Buffer.from(newContent, 'base64')
    //console.log(newBuf)
    let readStream = new stream.PassThrough()
    readStream.end(newBuf)
    res.set('content-disposition', 'attachment; filename=${data.rows[0].name}');
    // set content type accordingly
    const fileType = data.rows[0].type.split('.').join("");
    res.set('content-type', 'application/${fileType}');
    readStream.pipe(res)
  } catch(error){
    console.log(error);
    res.status(400).send(error)
  }
})


app.listen(PORT, (req, res) => console.log(`running server on port ${PORT}`))