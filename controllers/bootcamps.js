const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../common/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../common/utils/geocoder');

const successHandler = (res, data = null, message = null) => {
	res.status(200).json({ success: true, message, data });
	console.log(message ? message.brightWhite.bold.underline : 'Success!'.brightWhite.bold.underline);
};

/**
// @desc   - Get single bootcamp
// @route  - GET /api/v1/bootcamps/:id
// @access - Public
**/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	return bootcamp
		? successHandler(res, bootcamp, null)
		: next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404));
});

/**
// @desc   - Get all bootcamps
// @route  - GET /api/v1/bootcamps
// @access - Public
**/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();

	return bootcamps ? successHandler(res, bootcamps, null) : next(new ErrorResponse('No resources found', 404));
});

/**
// @desc   - Get bootcamps within a specified radius
// @route  - GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access - Public
**/
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	//Get lat/lng from geocoder
	const location = await geocoder(process.env.GEOCODER_PROVIDER, process.env.GEOCODER_API_KEY).geocode(zipcode);
	const latitude = location[0].latitude;
	const longitude = location[0].longitude;
	const earthRadius = 3963; // miles

	// Calc radius using radians
	// Divide distance by radius of earth
	const radius = distance / earthRadius;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
	});

	return bootcamps ? successHandler(res, bootcamps, null) : next(new ErrorResponse('No resources found', 404));
});

/**
// @desc   - Create bootcamp
// @route  - POST /api/v1/bootcamps
// @access - Private
**/
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	return bootcamp ? successHandler(res, bootcamp, null) : next(new ErrorResponse('Unable to create Bootcamp', 500));
});

/**
// @desc   - Update bootcamp
// @route  - PUT /api/v1/bootcamps
// @access - Private
**/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	return bootcamp
		? successHandler(res, bootcamp, `Successfully updated bootcamp ID: ${req.params.id}`)
		: next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404));
});

/**
// @desc   - Delete bootcamp
// @route  - DELETE /api/v1/bootcamps
// @access - Private
**/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

	return bootcamp
		? successHandler(res, bootcamp, `Successfully deleted bootcamp ID: ${req.params.id}`)
		: next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404));
});
