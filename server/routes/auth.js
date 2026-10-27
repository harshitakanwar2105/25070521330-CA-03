const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); // Middleware import kiya

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, city } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({ name, email, passwordHash, city });
    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name }, 
      process.env.JWT_SECRET || 'flexi_garage_super_secret_jwt_key', 
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, city: user.city } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, name: user.name }, 
      process.env.JWT_SECRET || 'flexi_garage_super_secret_jwt_key', 
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, city: user.city } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile (PUT /api/auth/profile)
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, email, city, password } = req.body;
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (city) user.city = city;

    // Agar naya password enter kiya hai toh use hash karke save karo
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;