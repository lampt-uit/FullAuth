const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/user.model');
const sendMail = require('../controllers/sendMail');
const { CLIENT_URL } = process.env;

const userController = {
	register: async (req, res) => {
		try {
			const { name, email, password } = req.body;

			if (!name || !email || !password)
				return res.status(400).json({ message: 'Please fill in all fields!' });

			if (!validateEmail(email))
				return res.status(400).json({ message: 'Invalid email' });

			const user = await Users.findOne({ email });

			if (user)
				return res.status(400).json({ message: 'This email already exists' });

			if (password.length < 6)
				res
					.status(400)
					.json({ message: 'Password must be at least 6 character' });

			const passwordHash = await bcrypt.hash(password, 12);

			const newUser = { name, email, password: passwordHash };

			const activation_token = createActivationToken(newUser);

			const url = `${CLIENT_URL}/user/activate/${activation_token}`;

			sendMail(email, url, 'Verify your email address');

			res.json({
				message: 'Register Successful. Please activate your email to start!'
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	activateEmail: async (req, res) => {
		try {
			const { activation_token } = req.body;

			//Get Payload=user(name,email,password,iat,exp)

			const user = jwt.verify(
				activation_token,
				process.env.ACTIVATION_TOKEN_SECRET
			);

			const { name, email, password } = user;

			const check = await Users.findOne({ email });

			if (check)
				return res.status(400).json({ message: 'This email already exists!' });

			const newUser = new Users({
				name,
				email,
				password
			});

			await newUser.save();

			res.json({ message: 'Account has been activated' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	login: async (req, res) => {
		const { email, password } = req.body;

		const user = await Users.findOne({ email });

		if (!user)
			return res.status(400).json({ message: 'This email does not exists!' });

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch)
			return res.status(400).json({ message: 'Password is incorrect!' });

		const refresh_token = createRefreshToken({ id: user._id });

		res.cookie('refreshtoken', refresh_token, {
			httpOnly: true,
			path: '/user/refresh_token',
			maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
		});

		res.json({ message: 'Login successful' });
	},
	getAccessToken: (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken;

			if (!rf_token)
				return res.status(400).json({ message: 'Please Login Now' });

			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err) return res.status(400).json({ message: 'Please Login Now' });

				const access_token = createAccessToken({ id: user.id });

				res.json({ access_token });
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;

			const user = await Users.findOne({ email });

			if (!user)
				return res.status(400).json({ message: 'This email does not exists!' });

			const access_token = createAccessToken({ id: user._id });
			const url = `${CLIENT_URL}/user/reset/${access_token}`;

			sendMail(email, url, 'Reset your password');

			res.json({ message: 'Re-send the password, please check your email!' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	resetPassword: async (req, res) => {
		try {
			const { password } = req.body;

			const passwordHash = await bcrypt.hash(password, 12);

			await Users.findOneAndUpdate(
				{ _id: req.user.id },
				{
					password: passwordHash
				}
			);

			res.json({ message: 'Password successfully changed' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getUserInfor: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id).select('-password');

			res.json(user);
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getUsersAllInfor: async (req, res) => {
		try {
			const users = await Users.find().select('-password');
			res.json(users);
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
			return res.json({ message: 'Logged out.' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updateUser: async (req, res) => {
		try {
			const { name, avatar } = req.body;
			await Users.findOneAndUpdate(
				{ _id: req.user.id },
				{
					name,
					avatar
				}
			);

			res.json({ message: 'Updated Successful' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updateUsersRole: async (req, res) => {
		try {
			const { role } = req.body;
			await Users.findOneAndUpdate(
				{ _id: req.params.id },
				{
					role
				}
			);

			res.json({ message: 'Updated Successful' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	deleteUser: async (req, res) => {
		try {
			await Users.findByIdAndDelete(req.params.id);

			res.json({ message: 'Deleted Success' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

const createActivationToken = (payload) => {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
		expiresIn: '5m'
	});
};

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m'
	});
};

const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7m'
	});
};

module.exports = userController;
