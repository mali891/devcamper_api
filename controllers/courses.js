const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../common/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const successHandler = require('../middleware/successHandler');

/**
// @desc   - Get all courses
// @route  - GET /api/v1/courses
// @route  - GET /api/v1/bootcamps/:bootcampId/courses
// @access - Public
**/
exports.getCourses = asyncHandler(async (req, res, next) => {
	let query;

	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else {
		query = Course.find().populate({
			path: 'bootcamp',
			select: 'name description'
		});
	}

	const courses = await query;

	res.status(200).json({ success: true, count: courses.length, data: courses });
});

/**
// @desc   - Get single course
// @route  - GET /api/v1/courses/:id
// @access - Public
**/
exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description'
	});

	return course
		? successHandler(res, course)
		: next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404));
});

/**
// @desc   - Add course
// @route  - POST /api/v1/bootcamps/:bootcampId/courses
// @access - Private
**/
exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return new ErrorResponse(`Resource with ID ${req.params.bootcampId} not found`, 404);
	}

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		data: course
	});
});

/**
// @desc   - Update course
// @route  - PUT /api/v1/course/:id
// @access - Private
**/
exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404);
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		success: true,
		data: course
	});
});

/**
// @desc   - Delete course
// @route  - DELETE /api/v1/course/:id
// @access - Private
**/
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404);
	}

	await course.remove();

	res.status(200).json({
		success: true,
		data: {}
	});
});
