const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flexi_garage')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/logs', require('./routes/logs'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');
// ... baaki middleware ke baad yeh add karo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/reports', require('./routes/reports'));