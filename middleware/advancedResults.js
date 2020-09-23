const advancedResults = (model, populate) => async (req, res, next) => {
	let query;

	const reqQuery = { ...req.query };

	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit'];

	// Delete fields from request query
	removeFields.forEach(param => delete reqQuery[param]);

	// Create query string
	let queryString = JSON.stringify(reqQuery);

	// Create operators ($gt, $gte, $lt, etc)
	queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

	query = model.find(JSON.parse(queryString));

	// Select fields
	if (req.query.select) {
		query = query.select(req.query.select.split(',').join(' '));
	}

	// Sort fields
	if (req.query.sort) {
		query = query.sort(req.query.sort.split(',').join(' '));
	} else {
		query = query.sort('-createdAt');
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	const models = await query;

	// Pagination result
	const pagination = {};

	if (endIndex < total) {
		pagination.next = { page: page + 1, limit };
	}

	if (startIndex > 0) {
		pagination.prev = { page: page - 1, limit };
	}

	res.advancedResults = {
		success: true,
		count: models.length,
		pagination,
		data: models
	};

	next();
};

module.exports = advancedResults;
