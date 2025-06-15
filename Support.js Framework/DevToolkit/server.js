const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Serve static files from current directory
app.use(express.static('.'));

// Serve the main demo page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve built library files
app.use('/dist', express.static('./dist'));

// Serve examples
app.use('/examples', express.static('./examples'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Support.js Demo Server running on http://0.0.0.0:${PORT}`);
});