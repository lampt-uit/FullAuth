import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
	isEmpty,
	isEmail,
	isLength,
	isMatch
} from '../../utils/validation/Validation';
import {
	showErrMsg,
	showSuccessMsg
} from '../../utils/notification/Notification';

const initialState = {
	name: '',
	email: '',
	password: '',
	cf_password: '',
	err: '',
	success: ''
};

function Register() {
	const [user, setUser] = useState(initialState);
	const { name, email, password, cf_password, err, success } = user;

	const handleChangeInput = (e) => {
		const { name, value } = e.target; //element input
		setUser({ ...user, [name]: value, err: '', success: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isEmpty(name) || isEmpty(email))
			return setUser({
				...user,
				err: 'Please fill in all fields.',
				success: ''
			});

		if (!isEmail(email))
			return setUser({ ...user, err: 'Invalid email.', success: '' });

		if (isLength(password))
			return setUser({
				...user,
				err: 'Password must be at least 6 characters.',
				success: ''
			});

		if (!isMatch(password, cf_password))
			return setUser({
				...user,
				err: 'Password did not match.',
				success: ''
			});
		try {
			const res = await axios.post('/user/register', {
				name,
				email,
				password
			});

			setUser({ ...user, err: '', success: res.data.message });
		} catch (error) {
			error.response.data.message &&
				setUser({
					...user,
					err: error.response.data.message,
					success: ''
				});
		}
	};

	return (
		<div className='login_page'>
			<h2>Register</h2>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='name'>Enter your name</label>
					<input
						type='text'
						placeholder='Enter your name'
						id='name'
						value={name}
						name='name'
						onChange={handleChangeInput}
					/>
				</div>
				<div>
					<label htmlFor='email'>Email Address</label>
					<input
						type='text'
						placeholder='Enter email address'
						id='email'
						value={email}
						name='email'
						onChange={handleChangeInput}
					/>
				</div>

				<div>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						placeholder='Enter password'
						id='password'
						value={password}
						name='password'
						onChange={handleChangeInput}
					/>
				</div>
				<div>
					<label htmlFor='cf_password'>Confirm Password</label>
					<input
						type='password'
						placeholder='Enter password again'
						id='cf_password'
						value={cf_password}
						name='cf_password'
						onChange={handleChangeInput}
					/>
				</div>

				<div className='row'>
					<button type='submit'>Register</button>
				</div>
			</form>

			<p>
				Already an account? <Link to='/login'>Login</Link>
			</p>
		</div>
	);
}

export default Register;
