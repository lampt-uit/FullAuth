import React, { useState } from 'react';
import axios from 'axios';

import { isEmail } from '../../utils/validation/Validation';
import {
	showErrMsg,
	showSuccessMsg
} from '../../utils/notification/Notification';
const initialState = {
	email: '',
	err: '',
	success: ''
};

function ForgotPassword() {
	const [data, setData] = useState(initialState);

	const { email, err, success } = data;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value, err: '', success: '' });
	};

	const forgotPassword = async () => {
		if (!isEmail(email)) {
			return setData({ ...data, err: 'Invalid Email', success: '' });
		}

		try {
			const res = await axios.post('/user/forgot', { email });
			setData({ ...data, err: '', success: res.data.message });
		} catch (error) {
			error.response.data.message &&
				setData({ ...data, err: error.response.data.message, success: '' });
		}
	};

	return (
		<div className='fg_pass'>
			<h2>Forgot Your Password</h2>
			<div className='row'>
				{err && showErrMsg(err)} {success && showSuccessMsg(success)}
				<label htmlFor='email'>Enter your email address</label>
				<input
					type='email'
					name='email'
					id='email'
					value={email}
					onChange={handleChangeInput}
				/>
				<button onClick={forgotPassword}>Verify Your Email</button>
			</div>
		</div>
	);
}

export default ForgotPassword;
