const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Register user
//@route Get /api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  //Create Token
  const token = user.getSignedJwtToken()

  res.status(200).json({ success: true, token })
})

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  //validate email and pw
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  //Check user
  const user = await User.findOne({ email }).select('+password')
  //validate user with email
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  //check if password matches..returns true or false based on if a match
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  //Create Token
  const token = user.getSignedJwtToken()

  res.status(200).json({ success: true, token })
})