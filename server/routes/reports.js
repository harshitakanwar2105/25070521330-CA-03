const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Log = require('../models/Log');
const Document = require('../models/Document');
const authMiddleware = require('../middleware/auth');

// GET: Fetch analytics and summary reports for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const vehicles = await Vehicle.find({ user: userId });
    const logs = await Log.find({ user: userId });
    const documents = await Document.find({ user: userId });

    // Calculate Total Maintenance Spend
    const totalSpend = logs.reduce((acc, log) => acc + Number(log.cost || 0), 0);

    // Fleet Health Status Breakdown
    const healthyCount = vehicles.filter(v => v.status === 'Healthy').length;
    const serviceDueCount = vehicles.filter(v => v.status === 'Service Due').length;
    const repairCount = vehicles.filter(v => v.status === 'In Repair').length;

    // Cost Breakdown per Vehicle
    const vehicleCostMap = {};
    logs.forEach(log => {
      if (!vehicleCostMap[log.vehicle]) {
        vehicleCostMap[log.vehicle] = 0;
      }
      vehicleCostMap[log.vehicle] += Number(log.cost || 0);
    });

    res.json({
      totalVehicles: vehicles.length,
      totalDocuments: documents.length,
      totalLogs: logs.length,
      totalSpend,
      fleetHealth: {
        healthy: healthyCount,
        serviceDue: serviceDueCount,
        inRepair: repairCount
      },
      vehicles
    });
  } catch (err) {
    console.error('Error generating reports:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;