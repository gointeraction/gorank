import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Use environment variable for secret key, with a fallback
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_development_secret_2024';

// Simulated user store (in production, use a database)
const USERS = {
  admin: {
    // Use bcrypt to hash password
    password: bcrypt.hashSync('adminpassword', 10)
  }
};

export async function generateToken(username) {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

export async function authenticateUser(username, password) {
  const user = USERS[username];
  
  if (!user) {
    console.warn(`Login attempt for non-existent user: ${username}`);
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (isPasswordValid) {
    return generateToken(username);
  }
  
  console.warn(`Failed login attempt for user: ${username}`);
  return null;
}

export function isAuthenticated(request) {
  const token = request.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}
