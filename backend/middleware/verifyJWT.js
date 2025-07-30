// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const verifyJWT = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   const token = authHeader.split(' ')[1];
//   try {
//     // Clerk JWT verification (replace with Clerk's public key in production)
//     const decoded = jwt.verify(token, process.env.CLERK_JWT_PUBLIC_KEY);
//     const user = await User.findOne({ clerkId: decoded.sub });
//     if (!user) return res.status(401).json({ error: 'User not found' });
//     req.user = user;
//     req.userId = decoded.sub;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token', details: err.message });
//   }
// };

// export default verifyJWT; 


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Use environment variable for secret or Clerk public key
    const secret = process.env.JWT_SECRET || process.env.CLERK_JWT_PUBLIC_KEY;

    if (!secret) {
      return res.status(500).json({ error: 'JWT secret or Clerk public key is not defined in environment' });
    }

    // Verify token
    const decoded = jwt.verify(token, secret);
    console.log('Decoded user:', decoded);

    // Match clerkId with database user
    const user = await User.findOne({ clerkId: decoded.sub });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Attach user to request
    req.user = user;
    req.userId = decoded.sub;
    req.user._id = user._id;
    


    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token', details: err.message });
  }
};

export default verifyJWT;
