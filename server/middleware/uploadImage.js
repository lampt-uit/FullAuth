const fs = require('fs');

module.exports = async function (req, res, next) {
	try {
		//Check file ?
		if (!req.files || Object.keys(req.files).length === 0)
			return res.status(400).json({ message: 'No files were uploaded.' });

		const file = req.files.file;

		// console.log(file);

		//If file size > 1mb => reject
		if (file.size > 1024 * 1024) {
			removeTmp(file.tempFilePath);
			return res.status(400).json({ message: 'Size too large' });
		}

		//If type file different jpeg or png  => reject
		if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
			removeTmp(file.tempFilePath);
			return res.status(400).json({ message: 'Format file is incorrect.' });
		}

		next();
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const removeTmp = (path) => {
	fs.unlink(path, (err) => {
		if (err) throw err;
	});
};
