const User = require('../models/User');
const ErrorResponse = require('../common/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const successHandler = require('../middleware/successHandler');

/**
// @desc   - Register user
// @route  - GET /api/v1/auth/register
// @access - Public
**/

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	const user = await User.create({ name, email, password, role });
	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, data: { user, token } });
});
