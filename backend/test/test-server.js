const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { pool } = require('../config/pool.js')
const server = require('../server.js')

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

const { 
    getAvailableJobscheck,
    getAllActiveJobscheck,
    getAllinActiveJobscheck,
    getMyJobscheck,
    getCurrentJobscheck,
    getPastJobscheck,
    addJobCheck,
    claimJobcheck,
    deleteJobCheck,
    dropJobCheck,
    updateJobCheck
} = require('./tests/jobTest')

const {
    getConfigCheck,
    updateAppConfigCheck
} = require('./tests/configTest')

// keeps track of the created admin and transcriber account
let adminCreated = false
let adminID = null
let transcriberCreated = false
let transcriberID = null

// please make sure that .env file is set to development and has the following variables:
console.log(`Environment Type: ${process.env.NODE_ENV}`)
console.log(`Environment Port: ${process.env.PORT}`)
console.log(`Database URL: ${process.env.DATABASE_URL}`)
console.log(`JWT Secret: ${process.env.JWT_SECRET}`)
console.log(`FRONT END URL: ${process.env.FRONTEND_URL}`)
console.log(`SendGrid API KEY (DO NOT SHARE): ${process.env.SENDGRID_API_KEY}`)


console.log("\n!! Please make sure SSL mode is turned off for this test to work locally! !!\n!! All data tables must be present for the tests to pass! !!\n")

before( () => {

    if (process.env.NODE_ENV !== 'development') {
        throw new Error('This test suite should only be run in development mode')
    }

    it ('discord bot', (done) => {
        server.on('DISCORD_LOGIN_SUCCESS', () => {
            done()
        })
    })

    it('Create admin account if it doesn\'t exist', (done) => {
        const checkAdminQuery = `SELECT * FROM \"user\" WHERE username = 'admin'`
        pool.query(checkAdminQuery).then((checkAdmin) => {
            if (checkAdmin.rowCount === 0) {
                const adminInsertQuery = {
                    text: 'INSERT into \"user\" (username, password,  email, discordid, role, togglediscordpm, toggleemailnotification) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                    values: ['admin', '$2a$10$VUAoMDwxp6N.GeYNeUgWKu6ySLi9SzIQES2pgrTbTHt6DiypOa1/S','admin@poggers.com', '146787205606539264', 'admin', true, true]
                }
                pool.query(adminInsertQuery)
                    .then( (result) => {
                        adminID = result.rows[0].id
                        adminCreated = true
                        done()
                    })
                    .catch( (err) => {
                        throw new Error(err)
                    })
            } else {
                done()
            }

        }).catch( (err) => {
            throw new Error(err)
        })
    })

    it('Create transcriber account if it doesn\'t exist', (done) => {
        const checkTranscriberQuery = `SELECT * FROM \"user\" WHERE username = 'transcriber'`
        pool.query(checkTranscriberQuery).then((checkTranscriber) => {
            if (checkTranscriber.rowCount === 0) {
                const transcriberInsertQuery = {
                    text: 'INSERT into \"user\" (username, password, email, role, togglediscordpm, toggleemailnotification) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                    values: ['transcriber', '$2a$10$vD/cn.a1hxPEr75PemL/FOHLDEqUfdD3scq5dEZZ4zl5qY0fUP7vi','transcriber@poggers.com', 'transcriber', false, true]
                }
                pool.query(transcriberInsertQuery).then( (result) => {
                        transcriberID = result.rows[0].id
                        transcriberCreated = true
                        done()
                    })
                    .catch( (err) => {
                        throw new Error(err)
                    })

            } else {
                done()
            }
        }).catch( (err) => {
            throw new Error(err)
        })
    })

})


describe('Login System:', () => {
    it('should register a new user on a POST /api/user', registerCheck)
    it('should login to newly created account on POST /api/user/login', loginCheck)
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

describe('Job system:', () => {
    it('should get all available jobs by roles on GET /api/job', getAvailableJobscheck)
    it('should get all active jobs for the admin on GET /api/job/admin/active', getAllActiveJobscheck)
    it('should get all active jobs for the admin on GET /api/job/admin/inactive', getAllinActiveJobscheck)
    it('should get all jobs created by the user on GET /api/job/my', getMyJobscheck)
    it('should get all ongoing jobs created by the user on GET /api/job/current', getCurrentJobscheck)
    it('should get all ongoing jobs created by the user on GET/api/job/past', getPastJobscheck)
    it('should add a new job and its corresponding files on GET /api/job', addJobCheck)
    it('should claim a job on PUT /api/job/claim/:id', claimJobcheck)
    it('should drop a job on PUT /api/job/drop/:id', dropJobCheck)
    it('should claim a job again on PUT /api/job/claim/:id', claimJobcheck)
    it('should update a job on PUT /api/job/update/:id', updateJobCheck)
    it('should delete a job on DELETE /api/job/admin/delete/:id', deleteJobCheck);
});

describe('Config System:', () => {
    it('should get all configs on GET /api/config', getConfigCheck)
    it('should update config on PUT /api/config', updateAppConfigCheck)
})

after( async () => {

    loginCheckCleanUp()
    fileCheckCleanUp()

    if (adminCreated) {
        const adminDeleteQuery = {
            text: 'DELETE FROM \"user\" WHERE id = $1',
            values: [adminID]
        }
        await pool.query(adminDeleteQuery)
    }

    if (transcriberCreated) {
        const transcriberDeleteQuery = {
            text: 'DELETE FROM \"user\" WHERE id = $1',
            values: [transcriberID]
        }
        await pool.query(transcriberDeleteQuery)
    }
    
})