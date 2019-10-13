// Dependencies
const express = require('express');

// Server
const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'Project Vault API'
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));
