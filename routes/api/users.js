const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const bycrpt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// user model
const Item = require('../../models/User');

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    //Simple Validation
    if(!name || !email || !password) {
        return res.status(400).json({msg: 'Please enter all fields'})
    }

    // Check for exsisting user
    User.findOne({ email })
    .then(user => {
        if(user) return res.status(400).json ({ msg: 'User already exists'});

        const newUser = new User({
            name,
            email,
            password
        });

        // Create salt & hash
        bycrpt.genSalt(10, (err, salt) => {
            bycrpt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => {

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 }, 
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )
                });
            })
        })
    })
});

module.exports = router;