const nodeGeocoder = require('node-geocoder');

const geocoder = (provider, apiKey) =>
	nodeGeocoder({
		provider,
		httpAdapter: 'https',
		apiKey,
		formatter: null
	});

module.exports = geocoder;
