const express = require('express');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const { User, generateToken, validate } = require('../models/User');

const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/:username', verifyToken, async (req, res) => {
    if (req.params.username !== req.decoded.username) return res.sendStatus(403);

    const user = await User.findOne({ username: req.params.username });
    return res.json({
        name: user.name,
        username: user.username
    });
});

router.post('/auth', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Invalid username or password');

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) return res.status(400).json({ success: match, message: 'Invalid username or password' });

    const authToken = generateToken(user);
    res.json({ success: match, authToken });
});

router.post('/register', (req, res) => {
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
