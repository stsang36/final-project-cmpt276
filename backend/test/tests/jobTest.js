const fs = require('fs')
const chai = require('chai')
const chaiHttp = require('chai-http')
const dotenv = require('dotenv')
const server = require('../../server')
const getTranscriberToken = require('./transcriberToken')
const getAdminToken = require('./adminToken')
const path = require('path')
dotenv.config({path: '../../.env'})



chai.should();
chai.use(chaiHttp)

let id = null;


const getAvailableJobscheck = (done) => {
    getTranscriberToken().then((transcriberToken) => {
        
        if (!transcriberToken) {
            throw new Error('Transcriber token not found')
        }

        chai.request(server)
            .get('/api/job')
            .set('Authorization',`Bearer ${transcriberToken}`)
            .end((error,res)=>{
                if (error) {
                    throw new Error(error)
                }
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
        })
};

const getAllActiveJobscheck = (done) => {
    getAdminToken().then( (adminToken) => {
        chai.request(server)
            .get('/api/job/admin/active')
            .set('Authorization',`Bearer ${adminToken}`)
            .end((error,res)=>{
                if(error)
                {
                    console.log(error)
                    done();
                }
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })
};

const getAllinActiveJobscheck = (done) => {
    getAdminToken().then( (adminToken) => {
        if (!adminToken) {
            throw new Error('Admin token not found')
        }
        
        chai.request(server)
                .get('/api/job/admin/inactive')
                .set('Authorization',`Bearer ${adminToken}`)
                .end((error,res)=>{
                    if (error) {
                        throw new Error(error)
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    done();
                })
    })
};

const getMyJobscheck = (done) => {
    getTranscriberToken().then( (transcriberToken) => {
        
        if (!transcriberToken) {
            throw new Error('Transcriber token not found')
        }

        chai.request(server)
            .get('/api/job/my')
            .set('Authorization',`Bearer ${transcriberToken}`)
            .end((error,res)=>{
                if (error) {
                    throw new Error(error)
                }

                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })
};

const getCurrentJobscheck = (done) => {
    getTranscriberToken().then( (transcriberToken) => {

        if (!transcriberToken) {
            throw new Error('Transcriber token not found')
        }

        chai.request(server)
            .get('/api/job/current')
            .set('Authorization',`Bearer ${transcriberToken}`)
            .end((error,res)=>{
                if(error)
                {
                    console.log(error)
                    done();
                }
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })
};

const getPastJobscheck = (done) => {
    getTranscriberToken().then( (transcriberToken) => {
        
        if (!transcriberToken) {
            throw new Error('Transcriber token not found')
        }

        chai.request(server)
            .get('/api/job/PAST')
            .set('Authorization',`Bearer ${transcriberToken}`)
            .end((error,res)=>{
                if (error) {
                    throw new Error(error)
            }

                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })
};
const addJobCheck = (done) => {

    const fileName = 'sample.pdf'
    const fileType = 'application/pdf'
    const filePath = path.resolve(__dirname, `../testFiles/${fileName}`)
    const file = fs.readFileSync(filePath, 'base64')
    let myTime = new Date()
    myTime.setDate(myTime.getDate() + 5);
    myTime = myTime.toISOString();

    fileobj ={
        deadline: myTime,
        file: {
            'media': file,
            'name': fileName,
            'type': fileType
        }
    }
    getAdminToken().then( (adminToken) => {

        if (!adminToken) {
            throw new Error('Admin token not found')
        }

        chai.request(server)
        .post(`/api/job`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(fileobj)
            .end((error, res) => {
            
                if (error) {
                    throw new Error(error)
                }

                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.equal(`job has been posted`);
                res.body.should.have.property('jobId');
                res.body.jobId.should.be.a('number');
                id = res.body.jobId;
                done();
            });
    })
}


const claimJobcheck = (done) => {

    getTranscriberToken().then( (transcriberToken) => {

        if (!id) {
            throw new Error('ID not found')
        }

        if (!transcriberToken) {
            throw new Error('Transcriber token not found')
        }
    
        chai.request(server)
            .put(`/api/job/claim/${id}`)
            .set('Authorization',`Bearer ${transcriberToken}`)
            .end((error,res)=>{
                if (error) {
                    throw new Error(error)
                }
    
                res.should.have.status(200);
                res.body.message.should.equal('job has been claimed successfully')
                res.should.be.json;
                done();
            })
    })
}

const updateJobCheck = (done) => {
    getTranscriberToken().then( (transcriberToken) => {

        if (!id) {
            throw new Error('ID not found')
        }

        if (!transcriberToken) {
            throw new Error('Transcriber token not found')
        }
    
        chai.request(server)
            .put(`/api/job/update/${id}`)
            .set('Authorization',`Bearer ${transcriberToken}`)
            .end((error,res)=>{
                if (error) {
                    throw new Error(error)
                }
    
                res.should.have.status(200);
                done();
            })
    })
}

const dropJobCheck = (done) => {
    getTranscriberToken().then( (transcriberToken) => {

        if (!id) {
            throw new Error('ID not found')
        }

        if (!transcriberToken) {
            throw new Error('Transcriber token not found')
        }
    
        chai.request(server)
            .put(`/api/job/drop/${id}`)
            .set('Authorization',`Bearer ${transcriberToken}`)
            .end((error,res)=>{
                if (error) {
                    throw new Error(error)
                }
    
                res.should.have.status(200);
                res.body.message.should.equal('job has been successfully dropped')
                res.should.be.json;
                done();
            })
    })
}

const deleteJobCheck = (done) => {
    getAdminToken().then( (adminToken) => {

        if (!id) {
            throw new Error('ID not found')
        }

        if (!adminToken) {
            throw new Error('Admin token not found')
        }

        chai.request(server)
            .delete(`/api/job/admin/delete/${id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .end( (error, res) => {
                
                if (error) {
                    throw new Error(error)
                }

            res.should.have.status(200);
            res.should.be.json;
            res.body.message.should.equal(`job ${id} deleted`);
            done();
        });
    })
 }

module.exports = {
    getAvailableJobscheck,
    getAllActiveJobscheck,
    getAllinActiveJobscheck,
    getMyJobscheck,
    getCurrentJobscheck,
    getPastJobscheck,
    addJobCheck,
    claimJobcheck,
    updateJobCheck,
    dropJobCheck,
    deleteJobCheck
}