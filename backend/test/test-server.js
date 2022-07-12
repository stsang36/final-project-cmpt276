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

const adminAcct = {
    "username": "admin",
    "password": "admin"
}

const testingAcct = {
    "email": "test@gmail.com",
    "username": "testing",
    "password": "testing",
    "id": null
}

//read file from /testFiles and convert to base64

before( () => {
    it('should login with admin account for further testing', (done) => {
        chai.request(server)
        .post('/api/user/login')
        .send(adminAcct)
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

describe('loginSystem', () => {
    it('should register a new user on a POST request /api/user', (done) => { 
        chai.request(server)
        .post('/api/user')
        .send(testingAcct)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done()
            }

            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('token')
            res.body.should.have.property('id')
            res.body.should.have.property('username')
            res.body.should.have.property('email')
            res.body.should.have.property('role')
            res.body.email.should.equal(testingAcct.email)
            res.body.username.should.equal(testingAcct.username)
            res.body.token.should.be.a('string')
            res.body.id.should.be.a('number')
            testingAcct.id = res.body.id;
            done()
        })

    })

    it('should login to newly created account on POST request /api/user/login', (done) => {
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
                done()
            })
    })

    it('should delete newly created account on DELETE request /api/user/admin/:id', (done) => {
        chai.request(server)
            .delete('/api/user/admin/' + testingAcct.id)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                
               if (err) {
                   console.log(err)
                   done()
               }
               
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal("success")
                done()
        })

    })
});

const fileName = 'sample.pdf'
const fileType = 'application/pdf'
const filePath = path.resolve(__dirname, `./testFiles/${fileName}`)
const file = fs.readFileSync(filePath, 'base64')
let id 

describe('fileSystem', () => {
    it('should upload a file for a POST on /api/file', (done) => {
        chai.request(server)
        .post('/api/file')
        .send({
            'file': file,
            'fileName': fileName,
            'fileType': fileType,
            'fileStatus': 'testing'
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

            res.headers['content-type'].should.equal(fileType);
            res.headers['content-disposition'].should.equal(`attachment; filename=${fileName}`);
            res.should.have.status(200);
            done();
        });
    })

    it('should delete a file for a DELETE on /api/file', (done) => {
        chai.request(server)
        .delete('/api/file').send({
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
