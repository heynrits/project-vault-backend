const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('../middlewares/auth');

const { Project, validate } = require('../models/Project');

const router = express.Router();

// CREATE one project
router.post('/', verifyToken, (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Get request payload
    const data = {
        name: req.body.name,
        description: req.body.description,
        urls: req.body.urls,
        creator: req.decoded.id // Made possible by verifyToken middleware
    };

    const project = new Project(data);
    project.save()
        .then((createdProject) => res.json({ createdProject, success: true }))
        .catch((err) => res.status(500).json({ success: false, error: err }));
});

// UPDATE one project
router.put('/:id', verifyToken, (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Get request payload
    const data = {
        _id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        urls: req.body.urls,
        creator: req.decoded.id
    };

    Project.findByIdAndUpdate(req.params.id, data, (err, updatedProject) => {
        if (err) return res.status(500).json({ success: false, error: err });

        return res.json({ success: true, updatedProject });
    });
});

// GET all projects
router.get('/', verifyToken, (req, res) => {
    Project.find({ creator: req.decoded.id }, (error, projects) => {
        if (error) return res.status(500).json({ error });

        return res.json({ projects });
    });
});

// GET one project
router.get('/:id', verifyToken, (req, res) => {
    Project.findOne({ _id: req.params.id, creator: req.decoded.id }, (error, project) => {
        if (error) return res.status(500).json({ error });

        return res.json(project);
    });
});

// DELETE one project
router.delete('/:id', verifyToken, (req, res) => {
    Project.deleteOne({ _id: req.params.id, creator: req.decoded.id }, (error) => {
        if (error) return res.status(500).json({ error });

        return res.json({ message: 'Project deleted.' });
    });
});

module.exports = router;
