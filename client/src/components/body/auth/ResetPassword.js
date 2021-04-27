import { React, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import {
	showErrMsg,
	showSuccessMsg
} from '../../utils/notification/Notification';
import { isLength, isMatch } from '../../utils/validation/Validation';

const initialState = {
	password: '',
	cf_password: '',
	err: '',
	success: ''
};

function ResetPassword() {
	const [data, setData] = useState(initialState);
	const { token } = useParams();

	const { password, cf_password, err, success } = data;
	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value, err: '', success: '' });
	};
	const handleResetPass = async () => {
		if (isLength(password))
			return setData({
				...data,
				err: 'Password must beat least 6 characters',
				success: ''
			});

		if (!isMatch(password, cf_password))
			return setData({ ...data, err: 'Password did not match.', success: '' });

		try {
			const res = await axios.post(
				'/user/reset',
				{ password },
				{
					headers: { Authorization: token }
				}
			);

			console.log(res);

			return setData({ ...data, err: '', success: res.data.message });
		} catch (error) {
			error.response.data.message &&
				setData({ ...data, err: error.response.data.message, success: '' });
		}
	};

	return (
		<div className='fg_pass'>
			<h2>Reset Your Password</h2>
			<div className='row'>
				{err && showErrMsg(err)} {success && showSuccessMsg(success)}
				<label htmlFor='password'>Enter New Password</label>
				<input
					type='password'
					name='password'
					id='password'
					value={password}
					onChange={handleChangeInput}
				/>
				<label htmlFor='cf_password'>Confirm Password</label>
				<input
					type='password'
					name='cf_password'
					id='cf_password'
					value={cf_password}
					onChange={handleChangeInput}
				/>
				<button onClick={handleResetPass}>Reset Password</button>
			</div>
		</div>
	);
}

export default ResetPassword;
