const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mediaDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schema for media files
const mediaSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});
const Media = mongoose.model('Media', mediaSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Save metadata to DB
    const newMedia = new Media({
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
    newMedia.save().then(() => {
        res.redirect('/');
    }).catch(err => res.status(500).send('DB error'));
});

app.get('/media', async (req, res) => {
    const media = await Media.find();
    res.json(media);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});