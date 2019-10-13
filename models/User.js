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
        require: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 8,
        maxlength: 255
    }
});

function generateToken() {
    return jwt.sign({ _id: this._id, username: this.username }, process.env.JWT_PRIVATE_KEY);
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
