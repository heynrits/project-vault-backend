// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

function dateNow() {
    return new Date(Date.now()).toLocaleString();
}

// Server
const app = express();
app.use(bodyParser.json());

// Database
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true })
    .then(async () => console.log(`${dateNow()}: Connected to MongoDB...`))
    .catch((err) => console.error(`${dateNow()}: Error connecting to MongoDB \n${err}`));

// Routers
const users = require('./routers/users');
const projects = require('./routers/projects');

app.use('/api/users', users);
app.use('/api/projects', projects);

app.get('/', (req, res) => {
    res.json({
        message: 'Project Vault API'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`${dateNow()}: Server started on port ${PORT}`));
