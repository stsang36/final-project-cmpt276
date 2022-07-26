const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})

const getPool = () => {
  if (process.env.NODE_ENV === 'development') {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  } else {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  }
}

const pool = getPool() // We don't need to comment out this everytime now

module.exports = {
  pool
}