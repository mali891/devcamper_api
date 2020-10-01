const User = require('../models/User');
const ErrorResponse = require('../common/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const successHandler = require('../middleware/successHandler');

/**
// @desc   - Register user
// @route  - POST /api/v1/auth/register
// @access - Public
**/

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	const user = await User.create({ name, email, password, role });

	if (user) {
		const token = user.getSignedJwtToken();
		res.status(200).json({ success: true, data: { user, token } });
	} else {
		return next(new ErrorResponse('User registration failed', 400));
	}
});

/**
// @desc   - Login user
// @route  - POST /api/v1/auth/login
// @access - Public
**/

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email and password
	if (!email || !password) {
		return next(new ErrorResponse('Please enter an email address and password', 400));
	}

	// Check for user
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorResponse('Please enter a valid email address', 401));
	}

	// Validate user entered password
	const passwordIsValid = await user.matchPassword(password);

	return passwordIsValid
		? sendTokenResponse(user, 200, res)
		: next(new ErrorResponse('Invalid email address or password', 401));
});

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	res
		.status(statusCode)
		.cookie('token', token, {
			expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'prod'
		})
		.json({ success: true, data: token });
};

/**
// @desc   - Get current logged in user
// @route  - POST /api/v1/auth/me
// @access - Private
**/

exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	return user ? res.status(200).json({ success: true, data: user }) : next(new ErrorResponse('No user found', 404));
});
