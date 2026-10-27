const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer Storage for Local Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'uploads' folder root me exist karta ho
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST: Upload a new document for a vehicle
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { vehicleId, title, docType, expiryDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a document file' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const newDoc = new Document({
      user: req.user.id || req.user._id,
      vehicle: vehicleId,
      title,
      docType,
      fileUrl,
      expiryDate
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    console.error('Error uploading document:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch all documents for a specific vehicle
router.get('/vehicle/:vehicleId', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ 
      vehicle: req.params.vehicleId, 
      user: req.user.id || req.user._id 
    });
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Remove a document by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findOne({ 
      _id: req.params.id, 
      user: req.user.id || req.user._id 
    });

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await doc.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;