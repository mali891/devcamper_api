const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
	id: mongoose.SchemaTypes.ObjectId,
	name: {
		type: String,
		required: [true, 'Please enter a name.'],
		unique: true,
		trim: true,
		maxLength: [50, 'Name cannot be more than 50 characters.']
	},
	slug: String,
	description: {
		type: String,
		required: [true, 'Please enter a description.'],
		trim: true,
		maxLength: [500, 'Description cannot be more than 500 characters.']
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Please enter a valid url.'
		]
	},
	phoneNumber: {
		type: String,
		trim: true,
		maxLength: [20, 'Phone number cannot be more than 20 characters.']
	},
	email: {
		type: String,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please enter a valid email address.'
		]
	},
	address: {
		type: String,
		required: [true, 'Please enter an address.']
	},
	location: {
		type: {
			type: String,
			required: false
		},
		coordinates: {
			type: [Number],
			index: '2dsphere'
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country: String
	},
	careers: {
		type: [String],
		required: true,
		enum: ['Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other']
	},
	averageRating: {
		type: Number,
		min: [1, 'Rating must be at least 1'],
		max: [10, 'Rating must not be more than 10']
	},
	averageCost: Number,
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	housing: {
		type: Boolean,
		default: false
	},
	jobAssistance: {
		type: Boolean,
		default: false
	},
	jobGuarantee: {
		type: Boolean,
		default: false
	},
	acceptGi: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
