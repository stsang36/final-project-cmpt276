const express = require("express")
const router = express.Router()

const { getjobs, addjob,deletejob } = require('../controllers/jobsController')

router.route("/").get(getjobs);

router.route("/addnewjob").get(addjob);

router.route("/:id").delete(deletejob)


module.exports = router