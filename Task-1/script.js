const express = require('express');
const app = express();

// Set up EJS view engine
app.set('view engine', 'ejs');

// Serve the form on the root route
app.get('/', (req, res) => {
    res.render('index');
});

// Handle the form submission
app.post('/submit', express.urlencoded({ extended: true }), (req, res) => {
    const { name, email } = req.body;
    res.render('result', { name, email });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
