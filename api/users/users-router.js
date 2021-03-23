// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router()
const User = require('./users-model')
const { restricted } = require('../auth/auth-middleware')

router.get('/',restricted, (req,res) =>{
  User.find().then((users) => {
    res.json(users)
  })
  .catch((err) => {
    console.log(err)
  })
})

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router