const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Create a User using: Post "/api/auth/CreateUser". No login required

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be minimum of 5 character').isLength({ min: 5 }),
], async (req, res) => {
  // If there are error return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check whether the email exist already
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ error: "Email already exists" })
    }
    // Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    res.json({ user })

  } catch (error) {
    console.log(error.messgae);
    res.status(500).send("Some error occured")
  }
})

module.exports = router