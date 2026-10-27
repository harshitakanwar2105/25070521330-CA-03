const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: String,
    required: true
  },
  regNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['SUV', 'Sedan', 'Hatchback', 'Commercial' , '2 Wheeler', 'suv', 'sedan', 'hatchback', 'commercial', '2 wheeler'],
    default: 'SUV'
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Diesel', 'Petrol', 'EV', 'CNG'],
    default: 'Diesel'
  },
  status: {
    type: String,
    required: true,
    enum: ['Healthy', 'Service Due', 'In Repair'],
    default: 'Healthy'
  },
  mileage: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);