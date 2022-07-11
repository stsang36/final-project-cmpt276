const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: '../.env'})
const fs = require('fs')
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../server')
let token

chai.use(chaiHttp)

console.log(`Environment Port: ${process.env.PORT}`)
console.log(`Database URL: ${process.env.DATABASE_URL}`)

//initiaite the tests poggers

const testingAcct = {
    "username": "admin",
    "password": "admin"
}



//read file from /testFiles and convert to base64

describe('login', () => {
    it('should return a token POST request /api/user/login', (done) => {
        chai.request(server)
            .post('/api/user/login')
            .send(testingAcct)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    done()
                }
                
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('token')
                token = res.body.token
                done()
            })
    })
})



const file = fs.readFileSync(path.resolve(__dirname, './testFiles/sample.pdf'), 'base64')
let id 

describe('fileSystem', () => {
    it('should upload a file for a POST on /api/file', (done) => {
        chai.request(server)
        .post('/api/file')
        .send({
            'file': file,
            'fileName': 'sample.pdf',
            'fileType': 'application/pdf',
            'fileStatus': 'sample'
        })
        .set('Authorization', `Bearer ${token}`)
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

    });

    it('should return a FILE on GET /api/file/:id', (done) => {
        chai.request(server)
        .get(`/api/file/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end( (error, res) => {
            
            if (error) {
                console.log(error)
                done();
            }

            res.should.have.status(200);
            done();
        });
    })

    it('should delete a file for a DELETE on /api/file', (done) => {
        chai.request(server).delete('/api/file').send({
            'fileId': id,
        })
        .set('Authorization', `Bearer ${token}`)
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

    });

});

