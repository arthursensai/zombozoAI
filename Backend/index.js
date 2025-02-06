const express = require('express');
const app = express();

require('dotenv').config();

app.get('/api', (req, res) => {
    res.status(200).send('ZombozoAI is working');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000')
})