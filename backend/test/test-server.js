const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: '../.env'})
const { pool } = require('../config/pool.js')

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
    updatePasswordCheck, 
    loginCheckCleanUp
} = require('./tests/loginTest')

const { 
    uploadFileCheck,
    getFileCheck, 
    deleteFileCheck, 
    fileCheckCleanUp
} = require('./tests/fileTest')

let adminCreated = false

console.log(`Environment Port: ${process.env.PORT}`)
console.log(`Database URL: ${process.env.DATABASE_URL}`)


before(async () => {

    if (process.env.NODE_ENV !== 'development') {
        throw new Error('This test suite should only be run in development mode')
    }

    // Create admin account if it doesn't exist
    const checkAdminQuery = `SELECT * FROM \"user\" WHERE username = 'admin'`
    const checkAdmin = await pool.query(checkAdminQuery)
    if (checkAdmin.rows.length === 0) {
        const adminInsertQuery = {
            text: 'INSERT into \"user\" (username, password, role, togglediscordpm, toggleemailnotification) VALUES ($1, $2, $3, $4, $5)',
            values: ['admin', '$2a$10$VUAoMDwxp6N.GeYNeUgWKu6ySLi9SzIQES2pgrTbTHt6DiypOa1/S', 'admin', false, false]
        }
        await pool.query(adminInsertQuery)
        adminCreated = true
    }

    return
})

describe('Login System:', () => {
    it('should register a new user on a POST request /api/user', registerCheck)
    it('should login to newly created account on POST request /api/user/login', loginCheck)
    it('should get the latest account settings on GET /api/user/settings using own token', settingCheck)
    it('should email user on forgetPassword on POST /api/user/forgotpassword/:user' , emailCheck)
    it('should update the account settings on PUT /api/user/settings', updateSettingCheck)
    it('should update user password on PUT /api/user/settings/changepassword', updatePasswordCheck)
    it('should reset user password on PUT /api/user/resetpassword', resetPasswordCheck) 
    it('should update user role on PUT /api/user/admin', updateUserRoleCheck)
    it('should get all users with admin token on GET /api/user/',  getAllUsersCheck)
    it('should delete newly created account on DELETE request /api/user/admin/:id', deleteUserCheck)

});


describe('File System:', () => {
    it('should upload a file for a POST on /api/file', uploadFileCheck)
    it('should return a FILE on GET /api/file/:id', getFileCheck)
    it('should delete a file for a DELETE on /api/file', deleteFileCheck)
    
});

after( async () => {
    loginCheckCleanUp()
    fileCheckCleanUp()

    // Delete admin account if created by this test suite
    if (adminCreated) {
        const adminDeleteQuery = `DELETE FROM \"user\" WHERE username = 'admin'`
        await pool.query(adminDeleteQuery)
    }
})