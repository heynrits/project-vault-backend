const Joi = require('joi');
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 300
    },
    urls: {
        feat_img: {
            type: String
        },
        docs: {
            type: String
        },
        demo: {
            type: String
        }
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Project = mongoose.model('Project', projectSchema);

function validate(project) {
    const schema = {
        name: Joi.string().required().max(50),
        description: Joi.string().required().max(300),
        creator: Joi.string().required()
    };

    return Joi.validate(project, schema);
}

module.exports = {
    Project,
    validate
};
