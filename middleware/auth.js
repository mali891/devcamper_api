const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../common/utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	// Make sure token exists
	if (!token) {
		return next(new ErrorResponse('Not authorised to access this route', 401));
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await User.findById(decoded.id);

		next();
	} catch (error) {
		return next(new ErrorResponse('Not authorised to access this route', 401));
	}
});

// Grant access to specific roles
exports.authorise = (...roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return next(new ErrorResponse(`User role ${req.user.role} is unauthorised to access this route`, 403));
	}

	next();
};
