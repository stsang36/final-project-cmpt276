const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: '../.env'})
const chai = require('chai')
const chaiHttp = require('chai-http')


const { 
    loginCheck, 
    registerCheck, 
    settingCheck, 
    emailCheck, 
    updateSettingCheck, 
    resetPasswordCheck, 
    getAllUsersCheck, 
    updateUserRoleCheck, 
    deleteUserCheck, 
    updatePasswordCheck 
} = require('./tests/loginTest')

const { 
    uploadFileCheck,
    getFileCheck, 
    deleteFileCheck 
} = require('./tests/fileTest')


chai.use(chaiHttp)
chai.should()

console.log(`Environment Port: ${process.env.PORT}`)
console.log(`Database URL: ${process.env.DATABASE_URL}`)

//initiaite the tests poggers

//read file from /testFiles and convert to base64

before( async () => {
    it('should eat a bagel', (done) => {done()})
})


describe('loginSystem', () => {

    it('should register a new user on a POST request /api/user', registerCheck)
    it('should login to newly created account on POST request /api/user/login', loginCheck)
    it('should get the latest account settings on GET /api/user/settings using own token', settingCheck)
    it ('should email user on forgetPassword on POST /api/user/forgotpassword/:user' , emailCheck)
    it('should update the account settings on PUT /api/user/settings', updateSettingCheck)
    it('should update user password on PUT /api/user/settings/changepassword', updatePasswordCheck)
    xit('should reset user password on PUT /api/user/resetpassword', resetPasswordCheck) 
    it('should update user role on PUT /api/user/admin', updateUserRoleCheck)
    it('should get all users with admin token on GET /api/user/',  getAllUsersCheck)
    it('should delete newly created account on DELETE request /api/user/admin/:id', deleteUserCheck)
});


describe('fileSystem', () => {
    it('should upload a file for a POST on /api/file', uploadFileCheck)
    it('should return a FILE on GET /api/file/:id', getFileCheck)
    it('should delete a file for a DELETE on /api/file', deleteFileCheck)

});

