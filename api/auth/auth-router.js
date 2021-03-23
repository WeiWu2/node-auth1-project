// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const User = require('../users/users-model')
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require('./auth-middleware')

router.post('/register',checkUsernameFree, checkPasswordLength,(req,res) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 10)
  const userForDb = {username, password:hash}
  User.add(userForDb)
  .then((user) => {
    res.json(user)
  })
  .catch((err) => {
    console.log(err)
  })
})
router.get('/', (req,res) => {
  User.find().then((users) => {
    res.json(users)
  })
})
router.post('/login', checkUsernameExists , (req,res) => {
  const { username, password } = req.body
  User.findBy(username)
  .first()
  .then((user) => {
    if(user && bcrypt.compareSync(password, user.password))
      {
        req.session.user = user
        res.json({message:`welcome ${username}`})
      }
      else
      res.status(500).json({message:'Invalid credentials'})
  })
 
})

router.get('/logout', (req,res) => {
  if(!req.session.user)
  res.json({message: "no session"})
  else
  req.session.destroy((err) => {
    if(err) {
      res.json({message: err})
    }
    else {
        res.json({message: "logged out"})
    }
})
})
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router