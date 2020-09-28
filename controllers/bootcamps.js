const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../common/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const successHandler = require('../middleware/successHandler');
const geocoder = require('../common/utils/geocoder');

/**
// @desc   - Get single bootcamp
// @route  - GET /api/v1/bootcamps/:id
// @access - Public
**/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	return bootcamp
		? successHandler(res, bootcamp)
		: next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404));
});

/**
// @desc   - Get all bootcamps
// @route  - GET /api/v1/bootcamps
// @access - Public
**/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
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

	return bootcamps ? successHandler(res, bootcamps) : next(new ErrorResponse('No resources found', 404));
});

/**
// @desc   - Create bootcamp
// @route  - POST /api/v1/bootcamps
// @access - Private
**/
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	console.warn('here');
	const bootcamp = await Bootcamp.create(req.body);

	return bootcamp ? successHandler(res, bootcamp) : next(new ErrorResponse('Unable to create Bootcamp', 500));
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
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404));
	}

	res.status(200).json({ success: true, data: {} });
});

/**
// @desc   - Upload bootcamp photo
// @route  - PUT /api/v1/bootcamps/:id/photo
// @access - Private
**/
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404));
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Verify that the file is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload an image file type`, 400));
	}

	// Verify file size
	if (file.size > process.env.MAX_FILE_SIZE) {
		return next(new ErrorResponse(`Please upload an image which is less than 1MB in size`, 400));
	}

	// Create unique filename
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
		if (error) {
			return next(new ErrorResponse(`Problem with file upload. Please try again later.`, 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
		res
			.status(200)
			.json({ success: true, data: `${file.name} successfully uploaded to ${process.env.FILE_UPLOAD_PATH}` });
	});
});
