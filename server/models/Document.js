const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  title: { type: String, required: true }, // e.g. "HDFC ERGO Insurance", "PUC 2026"
  docType: { 
    type: String, 
    enum: ['Insurance', 'RC Book', 'PUC Certificate', 'Service Invoice', 'Other'], 
    required: true 
  },
  fileUrl: { type: String, required: true }, // File ka path
  expiryDate: { type: Date } // Optional expiry tracking
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);