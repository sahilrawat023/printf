
import jwt from 'jsonwebtoken';

const payload = {
  sub: 'clerk_unique_id_126', // This should match clerkId in your DB
};

const secret = 'test123'; // Temporary secret for testing

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Test JWT Token:\n');
console.log(token);
