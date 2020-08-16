const Bootcamp = require('../models/Bootcamp');

const errorHandler = (res, error) => {
	res.status(400).json({ success: false, error: `Bad request: ${error ? error.message : 'Not found'}` });
	console.log(`Error: ${error ? error.message.brightRed.bold : 'Not found'}`.brightRed.bold);
};

const successHandler = (res, data = null, message = null) => {
	res.status(200).json({ success: true, message, data });
	console.log(message ? message.brightWhite.bold.underline : 'Success!'.brightWhite.bold.underline);
};

/**
// @desc   - Get single bootcamp
// @route  - GET /api/v1/bootcamps/:id
// @access - Public
**/
exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);

		return bootcamp ? successHandler(res, bootcamp, null) : errorHandler(res);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
// @desc   - Get all bootcamps
// @route  - GET /api/v1/bootcamps
// @access - Public
**/
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		return bootcamps ? successHandler(res, bootcamps, null) : errorHandler(res);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
// @desc   - Create bootcamp
// @route  - POST /api/v1/bootcamps
// @access - Private
**/
exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		return bootcamp ? successHandler(res, bootcamp, null) : errorHandler(res);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
// @desc   - Update bootcamp
// @route  - PUT /api/v1/bootcamps
// @access - Private
**/
exports.updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		return bootcamp
			? successHandler(res, bootcamp, `Successfully updated bootcamp ID: ${req.params.id}`)
			: errorHandler(res);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
// @desc   - Delete bootcamp
// @route  - DELETE /api/v1/bootcamps
// @access - Private
**/
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

		return bootcamp
			? successHandler(res, bootcamp, `Successfully deleted bootcamp ID: ${req.params.id}`)
			: errorHandler(res);
	} catch (error) {
		errorHandler(res, error);
	}
};
