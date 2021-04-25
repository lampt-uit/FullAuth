const jwt = require('jsonwebtoken');
const Users = require('../models/user.model');

const authAdmin = async (req, res, next) => {
	try {
		const user = await Users.findOne({ _id: req.user.id });

		if (user.role !== 1)
			return res.status(400).json({ message: 'Admin resource access denied.' });

		next();
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

module.exports = authAdmin;
