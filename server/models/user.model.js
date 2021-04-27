const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your name !'],
			trim: true
		},
		email: {
			type: String,
			required: [true, 'Please enter your email !'],
			trim: true,
			unique: true
		},
		password: {
			type: String,
			required: [true, 'Please enter your password !']
		},
		role: {
			type: Number,
			default: 0
		},
		avatar: {
			type: String,
			default:
				'https://res.cloudinary.com/lampt/image/upload/v1619536536/avatar/pngtree-character-default-avatar-image_2237203_ruxcgg.jpg'
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('User', userSchema);
