const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

// Route for the root path
app.get('/', (req, res) => {
  res.redirect('/auth');  // Automatically redirect to OAuth authorization flow
});

// Step 1: Redirect to Unsplash OAuth authorization page
app.get('/auth', (req, res) => {
  const authUrl = `https://unsplash.com/oauth/authorize?client_id=${process.env.UNSPLASH_CLIENT_ID}&redirect_uri=${process.env.UNSPLASH_REDIRECT_URI}&response_type=code&scope=public`;
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for an access token
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://unsplash.com/oauth/token', {
      client_id: process.env.UNSPLASH_CLIENT_ID,
      client_secret: process.env.UNSPLASH_CLIENT_SECRET,
      redirect_uri: process.env.UNSPLASH_REDIRECT_URI,
      code: code,
      grant_type: 'authorization_code'
    });

    const accessToken = response.data.access_token;

    // Send the access token to the frontend and let the user fetch photos
    res.send(`
      <html>
        <head>
          <title>Unsplash OAuth Example</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <div class="neumorphic-container">
            <h2>Access Token Received!</h2>
            <p>Click the button below to fetch photos from Unsplash.</p>
            <button id="fetchPhotos" class="neumorphic-btn">Fetch Photos</button>
            <div id="photos" class="photos-container"></div>
          </div>
          <script>
            const accessToken = '${accessToken}';
            
            document.getElementById('fetchPhotos').addEventListener('click', async () => {
              const response = await fetch('http://localhost:3000/photos', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + accessToken
                }
              });
              const photos = await response.json();
              const photosContainer = document.getElementById('photos');
              photosContainer.innerHTML = photos.map(photo => 
                \`<img src="\${photo.urls.small}" alt="\${photo.description}" class="photo">\`
              ).join('');
            });
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error exchanging code for token:', error.response ? error.response.data : error);
    res.status(500).send('Error during OAuth token exchange');
  }
});

// Step 3: Fetch photos from Unsplash
app.get('/photos', async (req, res) => {
  const accessToken = req.headers['authorization'].split(' ')[1]; // Extract token from header
  
  try {
    const response = await axios.get('https://api.unsplash.com/photos', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching photos:', error.response ? error.response.data : error);
    res.status(500).send('Error fetching photos');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
