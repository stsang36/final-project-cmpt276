const { pool } = require('../config/pool.js')

const getjobs = (req,res)=>{

   var getJobQUERY = "SELECT * FROM job"
    pool.query(getJobQUERY,(error,result)=>{
        if(error)
        {
            res.send(error);
        }
            
        var Jobresults = {'jobrows':result.rows}
        res.status(200).json(Jobresults);
    })

}
/*const addjob = async(req,res)=>{

var data = [req.body.id]
   var insertJobQuery  = "INSERT INTO job"

}*/

const deletejob =async (req,res)=>{

    const jobId = req.params.id
    const deleteUserQuery = {
        text : "delete from job where id =$1",
        values: [id]
    }
    await pool.query(deleteUserQuery)
    res.status(200).json({message:"Delete request called"})
    
}

const addJob = async() => {
  console.log('add job')
}


module.exports = { 
    getjobs,
    deletejob,
    addJob
  }