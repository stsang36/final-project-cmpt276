const server = require('../../server')
const chai = require('chai')
const chaiHttp = require('chai-http')
const getAdminToken = require('./adminToken')

chai.should()
chai.use(chaiHttp)

let testToken = null
let testId = null
let adminToken = null

getAdminToken().then( (myToken) => {
    adminToken = myToken
})



const testingAcct = {
    "email": "test@gmail.com",
    "username": "testing",
    "password": "testing",
    "id": null
}


const registerCheck = (done) => {

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
        testToken = res.body.token
        testId = res.body.id
        done()
    })

}    

const loginCheck = (done) => {
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
}

const settingCheck = (done) => {
    chai.request(server)
    .get(`/api/user/settings`)
    .set('Authorization', `Bearer ${testToken}`)
    .end((err, res) => {
        if (err) {
            console.log(err)
            done()
        }
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('username')
        res.body.should.have.property('email')
        res.body.should.have.property('discordId')
        res.body.should.have.property('toggleDiscordPm')
        res.body.should.have.property('toggleEmailNotification')
        res.body.username.should.equal(testingAcct.username)
        res.body.email.should.equal(testingAcct.email)
        done()
    })
}

const emailCheck = (done) => {
    chai.request(server)
    .post(`/api/user/forgotpassword/${testingAcct.username}`)
    .end((err, res) => {
        if (err) {
            console.log(err)
            done()
        }
        res.should.have.status(200)
        res.should.be.json
        res.body.should.have.property('message')
        res.body.message.should.equal('success')
        done()
    })
}

const updateSettingCheck = (done) => {
    let updatedSettings = {         
        "id": testId,     
        "username": "testingUpdated",
        "email": "testingUpdated@gmail.com",
        "discordId": "123456789",
        "toggleDiscordPm": true,
        "toggleEmailNotification": true
    }

    chai.request(server)
        .put(`/api/user/settings`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updatedSettings)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done()

            }
            res.should.have.status(200)
            res.should.be.json
            res.body.should.have.property('username')
            res.body.should.have.property('email')
            res.body.username.should.equal(updatedSettings.username)
            res.body.email.should.equal(updatedSettings.email)
            done()
        })
}

const updatePasswordCheck = (done) => {
    let updatedPassword = {         
        "id": testId,     
        "oldPassword": "testing",
        "newPassword": "testingUpdated"
    }

    chai.request(server)
        .put(`/api/user/settings/changepassword`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updatedPassword)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done()

            }
            res.should.have.status(200)
            res.should.be.json
            res.body.message.should.equal('success')
            done()
        })
}

const resetPasswordCheck = (done) => {
    let resetPasswordData = {    
        "token": myResetToken,
        "password": "myNewPassword"
    }

    chai.request(server)
        .put(`/api/user/resetpassword`)
        .send(resetPasswordData)
        .end((err, res) => {
            if (err) {
                console.log(err)
                done()

            }
            res.should.have.status(200)
            res.should.be.json
            res.body.should.have.property('id')
            res.body.should.have.property('username')
            res.body.should.have.property('email')
            res.body.should.have.property('role')
            res.body.should.have.property('token')
            res.body.username.should.equal(resetPasswordData.username)
            res.body.email.should.equal(resetPasswordData.email)
            res.body.token.should.not.equal(testToken)
            done()
        })   
}
const updateUserRoleCheck =  (done) => { 
    chai.request(server)
    .put(`/api/user/admin`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
        "id": testId,
        "role": "reviewer"
    })
    .end((err, res) => {
        if (err) {
            console.log(err)
            done()
        }
        res.should.have.status(200)
        res.should.be.json
        res.body.message.should.equal("success")
        done()
    })
}

const getAllUsersCheck =  (done) => {    
    chai.request(server)
    .get(`/api/user/`)
    .set('Authorization', `Bearer ${adminToken}`)
    .end((err, res) => {
        if (err) {
            console.log(err)
            done()
        }
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')
        done()
    })
}

const deleteUserCheck = (done) => {
    
    chai.request(server)
    .delete('/api/user/admin/' + testingAcct.id)
    .set('Authorization', `Bearer ${adminToken}`)
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
}



module.exports = {
    registerCheck,
    loginCheck,
    settingCheck,
    emailCheck,
    updateSettingCheck,
    updatePasswordCheck,
    resetPasswordCheck,
    updateUserRoleCheck,
    getAllUsersCheck,
    deleteUserCheck
}