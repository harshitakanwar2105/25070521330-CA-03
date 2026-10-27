const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Bearer Token (Authorization Header) ya x-auth-token dono se Read Karega
  let token = req.header('Authorization') || req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 2. Agar header me 'Bearer <token>' hai toh 'Bearer ' ko strip/hata kar sirf token le legi
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'flexi_garage_super_secret_jwt_key'
    );
    
    // 3. User object set karna (Decoded payload me id / _id hota hai)
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};