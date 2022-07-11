

const chai = require('chai')
const chaiHttp = require('chai-http')
const path = require('path')
const mockSession = require('mock-session')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})

let cookie = mockSession('Bearer', process.env.JWT_SECRET, {'role': 'admin'})


chai.use(chaiHttp)

//read file and convert to base64
const fs = require('fs')
const file = fs.readFileSync('./exampleFiles/sample.pdf', 'base64')
let id 

describe('fileSystem', () => {
    it('should upload a file for a POST on /api/file', (done) => {
        chai.request(server).post('/api/file').send({
            'file': file,
            'name': 'sample.pdf',
            'type': 'application/pdf',
            'fileStatus': 'sample'
        }).set('cookie', cookie);
        
        chai.end( (error, res) => {
            res.status.should.equal(200);
            res.should.be.json;
            res.body[0].fileId.should.be.number;
            res.body[0].message.should.equal('File uploaded successfully');
            id = res.body[0].id;
            done();
        });

    });

    it('should return a FILE on GET /api/file/:id', (done) => {
    
        chai.request(server).get(`/api/file/${id}`).set('cookie', cookie);
        chai.end( (error, res) => {
            res.status.should.equal(200);
            done();
        });
    })

    it('should delete a file for a DELETE on /api/file', (done) => {
        chai.request(server).delete('/api/file').send({
            'fileId': id,
        });
        
        chai.end( (error, res) => {
            res.status.should.equal(200);
            res.should.be.json;
            res.body[0].fileId.should.be.number;
            res.body[0].message.should.equal(`ID: ${id} deleted successfully.`);
            done();
        });

    });

});
