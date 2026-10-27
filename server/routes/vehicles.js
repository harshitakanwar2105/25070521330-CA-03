const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const authMiddleware = require('../middleware/auth');

// POST: Add new vehicle
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { model, regNumber, type, fuelType, status, mileage } = req.body;

    const newVehicle = new Vehicle({
      user: req.user.id || req.user._id,
      model,
      regNumber,
      type,
      fuelType,
      status,
      mileage
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    console.error("Backend Vehicle Save Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch all vehicles for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const vehicles = await Vehicle.find({ user: userId });
    res.json(vehicles);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Remove a vehicle by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const vehicle = await Vehicle.findOne({ _id: req.params.id, user: userId });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;