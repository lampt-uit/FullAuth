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
				'https://res.cloudinary.com/lampt/image/upload/v1619338006/avatar/421-4212287_default-avatar-male-user-icon-hd-png-download_glkp0v.jpg'
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('User', userSchema);
