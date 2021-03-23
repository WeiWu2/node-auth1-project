const User = require('../users/users-model')

function restricted(req,res,next) {
  if (req.session && req.session.user)
    next()
  else
    res.status(401).json({message:'You shall not pass!'})
}

function checkUsernameFree(req,res,next) {
  User.findBy(req.body.username).then((user) => {
    if(user.length === 0)
      next()
    else(
      res.status(422).json({message:'Username taken'})
    )
  })
  .catch((err) => {
    next(err)
  })
}

function checkUsernameExists(req,res,next) {
  User.findBy(req.body.username).then((user) => {
    if(user.length === 0)
    res.status(422).json({message:'Invalid credentials'})
    else(
      next()
    )
  })
  .catch((err) => {
    next(err)
  })
}

function checkPasswordLength(req,res,next) {
  if(!req.body.password || req.body.password.length < 3)
      res.status(422).json({message:'Password must be longer than 3 chars'})
    else
    next()
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}