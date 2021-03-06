require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles: true
	})
);

//Connect MongoDB
const URL = process.env.MONGODB_URL;
mongoose.connect(
	URL,
	{
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) throw err;
		console.log('Connect to MongoDB successfully.');
	}
);

app.use('/user', require('./routes/user.route'));
app.use('/api', require('./routes/upload.route'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
