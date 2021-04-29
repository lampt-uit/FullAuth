import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { dispatchLogin } from '../../redux/actions/auth.action';
import {
	showErrMsg,
	showSuccessMsg
} from '../../utils/notification/Notification';
import { GoogleLogin } from 'react-google-login';

const initialState = {
	email: '',
	password: '',
	err: '',
	success: ''
};

function Register() {
	const [user, setUser] = useState(initialState);
	const dispatch = useDispatch();
	const history = useHistory();
	const { email, password, err, success } = user;

	const handleChangeInput = (e) => {
		const { name, value } = e.target; //element input
		setUser({ ...user, [name]: value, err: '', success: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await axios.post('/user/login', { email, password });
			setUser({ ...user, err: '', success: res.data.message });
			localStorage.setItem('firstLogin', true);

			dispatch(dispatchLogin());
			history.push('/');
		} catch (error) {
			error.response.data.message &&
				setUser({
					...user,
					err: error.response.data.message,
					success: ''
				});
		}
	};

	const responseGoogle = async (response) => {
		// console.log(response);

		try {
			const res = await axios.post('/user/google_login', {
				tokenId: response.tokenId
			});
			setUser({ ...user, err: '', success: res.data.message });

			localStorage.setItem('firstLogin', true);
			dispatch(dispatchLogin());
			history.push('/');
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
			<h2>Login</h2>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			<form onSubmit={handleSubmit}>
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

				<div className='row'>
					<button type='submit'>Login</button>
					<Link to='/forgot_password'>Forgot your password ?</Link>
				</div>
			</form>
			<div className='hr'>Or Login With</div>
			<div className='social'>
				<GoogleLogin
					clientId='46740943345-k6f2uf6qb2fackl1t1f3ca2onl7omtev.apps.googleusercontent.com'
					buttonText='Login with Google'
					onSuccess={responseGoogle}
					onFailure={responseGoogle}
					cookiePolicy={'single_host_origin'}
				/>
			</div>
			<p>
				New customer? <Link to='/register'>Register</Link>
			</p>
		</div>
	);
}

export default Register;
