const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harryisagoodb$oy'

// Route 1: Create a User using: Post "/api/auth/CreateUser". No login required

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be minimum of 5 character').isLength({ min: 5 }),
], async (req, res) => {
  let success = false

  // If there are error return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  // Check whether the email exist already
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ success, error: "Email already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)

    // Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)

    // res.json({ user })
    success = true
    res.json({ success, authtoken })

  } catch (error) {
    console.log(error.messgae);
    res.status(500).send("Internal Seerver Error")
  }
})


// Route 2: Authenticate a user using: Post "/api/auth/CreateUser". No login required

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password Cannot be blank').exists(),

], async (req, res) => {
  // If there are error return bad request and the errors
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if (!user) {
      success = false
      return res.status(400).json({ "error": "Please try to login with correct credential" })
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, "error": "Please try to login with correct credential" })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({ success, authtoken })

  } catch (error) {
    console.log(error.messgae);
    res.status(500).send("Internal Seerver Error")
  }
}
)


// Route 3: Get loggedin User Details using : Post "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log('sdfghjkl');
    console.log(error.message);
    res.status(500).send("Internal Seerver Error")
  }
}
)


module.exports = router