const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../common/utils/geocoder');

const BootcampSchema = new mongoose.Schema(
	{
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Create bootcamp slug from name
BootcampSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// Geocode and create location field
BootcampSchema.pre('save', async function (next) {
	const location = await geocoder(process.env.GEOCODER_PROVIDER, process.env.GEOCODER_API_KEY).geocode(this.address);

	this.location = {
		type: 'Point',
		coordinates: [location[0].longitude, location[0].latitude],
		formattedAddress: location[0].formattedAddress,
		street: location[0].streetName,
		city: location[0].city,
		state: location[0].stateCode,
		zipCode: location[0].zipCode,
		country: location[0].countryCode
	};

	// Do not save address in DB
	this.address = undefined;

	next();
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
	console.log(`Courses being removed from bootcamp: ${this._id}`.brightRed.bold);
	await this.model('Course').deleteMany({ bootcamp: this._id });

	next();
});

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
	ref: 'Course',
	localField: '_id',
	foreignField: 'bootcamp',
	justOne: false
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
