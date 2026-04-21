// import { verifyAccessToken } from '../utils/jwt.js';
// import { httpError } from '../utils/response.js';
// import User from '../../models/user.model.js';

// const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return httpError(req, res, new Error('No token provided'), 401);
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = verifyAccessToken(token);

//     const user = await User.findById(decoded.userId).select('-password');

//     if (!user) {
//       return httpError(req, res, new Error('User not found'), 401);
//     }

//     if (!user.isActive) {
//       return httpError(req, res, new Error('Account is inactive'), 401);
//     }

//     req.user = user;
//     return next();
//   } catch {
//     return httpError(req, res, new Error('Invalid or expired token'), 401);
//   }
// };

// const isAdmin = (req, res, next) => {
//   if (req.user?.role !== 'admin') {
//     return httpError(req, res, new Error('Access denied. Admins only.'), 403);
//   }
//   return next();
// };

// export { authenticate, isAdmin };
