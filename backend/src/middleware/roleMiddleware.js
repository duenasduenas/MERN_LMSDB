// middleware/roleMiddleware.js

// authorizeRoles middleware factory
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      try {
        // Ensure verifyToken has already run
        const user = req.user;
  
        if (!user) {
          return res.status(401).json({ message: 'Unauthorized: No user data found' });
        }
  
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
        }
  
        next(); // ✅ Role is allowed — continue to route
      } catch (error) {
        console.error('Role authorization error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  };
  
  export default authorizeRoles;
  