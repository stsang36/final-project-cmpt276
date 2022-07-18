const fs = require('fs')
const chai = require('chai')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: '../../.env'})
const server = require('../../server')
const chaiHttp = require('chai-http')
const getAdminToken = require('./adminToken')
const { pool } = require('../../config/pool.js')

const fileName = 'sample.pdf'
const fileType = 'application/pdf'
const filePath = path.resolve(__dirname, `../testFiles/${fileName}`)
const file = fs.readFileSync(filePath, 'base64')
let id 

getAdminToken().then( (myToken) => {
    adminToken = myToken
})

chai.use(chaiHttp)
chai.should()

const uploadFileCheck = (done) => {
    chai.request(server)
        .post('/api/file')
        .send({
            'file': file,
            'fileName': fileName,
            'fileType': fileType,
            'fileStatus': 'testing'
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .end( (error, res) => {

            if (error) {
                console.log(error)
                done();
            }

            res.should.have.status(200);
            res.should.be.json;
            res.body.fileId.should.be.a('number');
            res.body.message.should.equal('File uploaded successfully');
            id = res.body.fileId;
            done();
        });
}

const getFileCheck = (done) => {
    chai.request(server)
        .get(`/api/file/${id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end( (error, res) => {
            
            if (error) {
                console.log(error)
                done();
            }

            res.headers['content-type'].should.equal(fileType);
            res.headers['content-disposition'].should.equal(`attachment; filename=${fileName}`);
            res.should.have.status(200);
            done();
        });
}

const deleteFileCheck = (done) => {
    chai.request(server)
        .delete('/api/file')
        .send({
            'fileId': id,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .end( (error, res) => {
            
            if (error) {
                console.log(error)
                done();
            }

            res.should.have.status(200);
            res.should.be.json;
            res.body.fileId.should.be.a('number');
            res.body.message.should.equal(`ID: ${id} deleted successfully.`);
            done();
        });
}


const fileCheckCleanUp = (done) => {
    pool.query('DELETE FROM \"file\" WHERE id = $1 or status = $2', [id, 'testing'])
    .then( () => { 
        done();
    })
}

module.exports = { 
    uploadFileCheck, 
    getFileCheck, 
    deleteFileCheck,
    fileCheckCleanUp

}