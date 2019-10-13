const express = require('express');

const { Project, validate } = require('../models/Project');

const router = express.Router();

// CREATE one project
router.post('/', (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Get request payload
    const data = {
        name: req.body.name,
        description: req.body.description,
        urls: req.body.urls,
        creator: req.body.creator
    };

    const project = new Project(data);
    project.save()
        .then((createdProject) => res.json({ createdProject, success: true }))
        .catch((err) => res.status(500).json({ success: false, error: err }));
});

// UPDATE one project
router.put('/:id', (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Get request payload
    const data = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        urls: req.body.urls,
        creator: req.body.creator
    };

    Project.findByIdAndUpdate(data.id, data, (err, updatedProject) => {
        if (err) return res.status(500).json({ success: false, error: err });

        res.json({ success: true, updatedProject });
    })
});

// GET all projects
router.get('/', (req, res) => {
    Project.find({ creator: req.body.creator }, (error, projects) => {
        if (error) return res.status(500).json({ error });

        return res.json({ projects });
    });
});

// GET one project
router.get('/:id', (req, res) => {
    Project.findOne({ _id: req.params.id }, (error, project) => {
        if (error) return res.status(500).json({ error });

        return res.json(project);
    });
});

// DELETE one project
router.delete('/:id', (req, res) => {
    Project.deleteOne({ _id: req.params.id }, (error) => {
        if (error) return res.status(500).json({ error });

        return res.json({ message: 'Project deleted.' });
    });
});

module.exports = router;
