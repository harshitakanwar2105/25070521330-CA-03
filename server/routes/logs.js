const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const authMiddleware = require('../middleware/auth');

// POST: Add a new service log
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { vehicleId, serviceType, cost, odometer, date, notes } = req.body;

    const newLog = new Log({
      user: req.user.id || req.user._id,
      vehicle: vehicleId,
      serviceType,
      cost,
      odometer,
      date,
      notes
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    console.error('Error saving log:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch all logs for a specific vehicle
router.get('/vehicle/:vehicleId', authMiddleware, async (req, res) => {
  try {
    const logs = await Log.find({ 
      vehicle: req.params.vehicleId, 
      user: req.user.id || req.user._id 
    }).sort({ date: -1 }); // Latest logs first
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Remove a service log by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const log = await Log.findOne({ 
      _id: req.params.id, 
      user: req.user.id || req.user._id 
    });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await log.deleteOne();
    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    console.error('Error deleting log:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;