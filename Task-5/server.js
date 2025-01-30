const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path'); // For handling file paths

const app = express();
const port = 3000;

// MongoDB URI from Atlas
const uri = 'mongodb+srv://KumarS:cwAEZ6dpCBCSKjmy@cluster0.zifoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
let client;

// MongoDB database and collection
let db;
let collection;

// Connect to MongoDB
async function connectDB() {
    try {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db('test');  
        collection = db.collection('items'); 
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit();
    }
}

// Initialize MongoDB connection
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// CREATE: Add new item to collection
app.post('/api/items', async (req, res) => {
    try {
        const newItem = req.body;
        const result = await collection.insertOne(newItem);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// READ: Get all items from the collection
app.get('/api/items', async (req, res) => {
    try {
        const items = await collection.find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// UPDATE: Update an existing item by ID
app.put('/api/items/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE: Delete an item by ID
app.delete('/api/items/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Catch-all route to serve the index.html if no API routes match
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
