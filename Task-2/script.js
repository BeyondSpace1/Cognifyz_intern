const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const url = require('url');

const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Serve the HTML form on GET request
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('index.html').pipe(res); // Ensure you have the HTML file
    }

    // Handle form submission on POST request
    else if (req.method === 'POST' && parsedUrl.pathname === '/submit-form') {
        let body = '';

        // Collect the form data
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            // Parse the body data from the form
            const formData = querystring.parse(body);

            // Server-side validation
            const { name, email, message } = formData;

            if (!name || !email || !message) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('All fields are required.');
                return;
            }

            // Email validation
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(email)) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid email address.');
                return;
            }

            // If validation passes, store data temporarily
            const validatedData = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\n`;

            // Store data in a temporary file
            fs.appendFile('temp_data.txt', validatedData, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error saving data.');
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Form submitted successfully and data stored temporarily.');
            });
        });
    } else {
        // Handle 404 for any other routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
