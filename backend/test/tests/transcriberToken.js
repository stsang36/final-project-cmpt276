const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const { pool } = require('../../config/pool.js')
const jwt = require('jsonwebtoken')

const getTranscriberToken = async () => {
    const results = await pool.query('SELECT * FROM \"user\" WHERE username = $1', ['transcriber'])
    const transcriberUser = results.rows[0]
    let token = jwt.sign({id: transcriberUser.id}, process.env.JWT_SECRET, {expiresIn: "3d"})
    return token
}

module.exports = getTranscriberToken