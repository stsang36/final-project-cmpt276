// handles all functions that are called in the route 'exampleRoutes', delete later

const loginGetFunction = (req, res) => {
    // insert get function here 
    console.log('login get function called')
    res.status(200).send({message: 'success'})
}
  
const loginPostFunction = (req, res) => {
    // insert post function here
    console.lost('login post function called')
    res.status(200).send({message: 'success'})
    
}
  
module.exports = { 
    loginGetFunction, 
    loginPostFunction
}