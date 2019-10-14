const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    }
});

function generateToken(user) {
    const payload = { id: user._id, username: user.username };
    return jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '30d' });
}

const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = {
        name: Joi.string().required().max(255),
        username: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(8).max(255)
    };

    return Joi.validate(user, schema);
}

module.exports = {
    User,
    validate,
    generateToken
};
