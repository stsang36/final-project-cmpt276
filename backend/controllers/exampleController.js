// handles all functions that are called in the route 'exampleRoutes', delete later

const exampleGetFunction = (req, res) => {
  // insert get function here 
  console.log('get function called')
  res.status(200).send({message: 'success'})
}

const examplePostFunction = (req, res) => {
  // insert post function here
  console.lost('post function called')
  res.status(200).send({message: 'success'})
}

module.exports = { 
  exampleGetFunction, 
  examplePostFunction
}