const express = require('express');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const { User } = require('../models/User');

const router = express.Router();

router.post('/', (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Get request payload
    const data = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    // Hash user password
    bcrypt.hash(data.password, saltRounds, (hashErr, hash) => {
        if (hashErr) {
            return res.status(500).json({
                success: false,
                error: hashErr
            });
        }

        data.password = hash;

        // Save new user to database
        const user = new User(data);
        user.save()
            .then((createdUser) => res.json({ createdUser, success: true }))
            .catch((err) => res.status(500).json({ success: false, error: err }));
    });
});

module.exports = router;
