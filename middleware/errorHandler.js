const ErrorResponse = require('../common/utils/errorResponse');

const ERROR_CODES = {
	DUPLICATE_KEY: 11000
};

const ERROR_KINDS = {
	OBJECT_ID: 'ObjectId',
	REQUIRED: 'required'
};

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// Log error to console
	console.log(err.stack.brightRed.bold);

	// Mongoose bad ObjectId
	if (error.kind === ERROR_KINDS.OBJECT_ID) {
		error = new ErrorResponse(`Resource with ID '${err.value}' not found.`, 404);
	}

	// Mongoose missing required field
	if (error.kind === ERROR_KINDS.REQUIRED) {
		error = new ErrorResponse(`Required field '${err.path}' missing. Please complete all missing fields.`, 400);
	}

	if (error.code === ERROR_CODES.DUPLICATE_KEY) {
		error = new ErrorResponse(`Item with name '${err.keyValue.name}' already exists.`, 400);
	}

	// Mongoose validation error
	if (error.errors) {
		error = new ErrorResponse(`Missing required fields: '${Object.keys(error.errors).join(', ')}'.`, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server error'
	});
};

module.exports = errorHandler;
