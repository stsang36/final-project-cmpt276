// handles all functions that are called in the route 'exampleRoutes', delete later

const loginGetFunction = async (req, res) => {
    // insert get function here 
    console.log('login get function called')

    res.status(200).send({message: 'success'})

    return;
}
  
const loginPostFunction = async (req, res) => {
    // insert post function here
    console.lost('login post function called')
    res.status(200).send({message: 'success'})
    
    return;
}
  
module.exports = { 
    loginGetFunction, 
    loginPostFunction
}