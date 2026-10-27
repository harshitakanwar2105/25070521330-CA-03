const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  serviceType: { 
    type: String, 
    enum: ['Routine Maintenance', 'Oil Change', 'Major Repair', 'Brake Inspection', 'Tire Replacement', 'Other'], 
    required: true 
  },
  cost: { type: Number, required: true },
  odometer: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);