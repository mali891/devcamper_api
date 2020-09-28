const express = require('express');
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	uploadBootcampPhoto
} = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);

router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, uploadBootcampPhoto);

module.exports = router;
