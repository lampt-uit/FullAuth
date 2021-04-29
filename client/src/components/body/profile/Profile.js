import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import {
	showErrMsg,
	showSuccessMsg
} from '../../utils/notification/Notification';
import { isLength, isMatch } from '../../utils/validation/Validation';
import {
	fetchAllUsers,
	dispatchGetAllUsers
} from '../../redux/actions/user.action';

const initialState = {
	name: '',
	password: '',
	cf_password: '',
	err: '',
	success: ''
};

function Profile() {
	const auth = useSelector((state) => state.auth);
	const token = useSelector((state) => state.token);
	const users = useSelector((state) => state.users);
	const dispatch = useDispatch();

	const { user, isAdmin } = auth;
	const [data, setData] = useState(initialState);
	const [avatar, setAvatar] = useState(false);
	const [loading, setLoading] = useState(false);
	const [callback, setCallback] = useState(false);

	const { name, password, cf_password, err, success } = data;

	useEffect(() => {
		if (isAdmin) {
			return fetchAllUsers(token).then((res) => {
				dispatch(dispatchGetAllUsers(res));
			});
		}
	}, [token, isAdmin, dispatch, callback]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value, err: '', success: '' });
	};

	const changeAvatar = async (e) => {
		e.preventDefault();
		try {
			const file = e.target.files[0];

			if (!file)
				return setData({ ...data, err: 'No files were uploaded', success: '' });

			if (file.size > 1024 * 1024)
				return setData({ ...data, err: 'Size too large', success: '' });
			if (file.type !== 'image/jpeg' && file.type !== 'image/png')
				return setData({
					...data,
					err: 'File format is incorrect',
					success: ''
				});

			let formData = new FormData();
			formData.append('file', file);
			setLoading(true);

			const res = await axios.post('/api/upload_avatar', formData, {
				headers: { 'content-type': 'multipart/form-data', Authorization: token }
			});

			setLoading(false);
			setAvatar(res.data.url);
		} catch (error) {
			setData({ ...data, err: error.response.data.message, success: '' });
		}
	};
	const updateInfor = async () => {
		try {
			await axios.patch(
				'/user/update',
				{
					name: name ? name : user.name,
					avatar: avatar ? avatar : user.avatar
				},
				{
					headers: { Authorization: token }
				}
			);

			setData({ ...data, err: '', success: 'Updated Success' });
		} catch (error) {
			setData({ ...data, err: error.response.data.message, success: '' });
		}
	};

	const updatePassword = async () => {
		if (isLength(password))
			return setData({
				...data,
				err: 'Password must beat least 6 characters',
				success: ''
			});

		if (!isMatch(password, cf_password))
			return setData({ ...data, err: 'Password did not match.', success: '' });

		try {
			await axios.post(
				'/user/reset',
				{ password },
				{
					headers: { Authorization: token }
				}
			);

			setData({ ...data, err: '', success: 'Updated Success' });
		} catch (error) {
			setData({ ...data, error: error.response.data.message, success: '' });
		}
	};

	const handleUpdate = () => {
		if (name || avatar) updateInfor();
		if (password) updatePassword();
	};

	const handleDelete = async (id) => {
		try {
			//If user login !== user is deleted => accept
			if (user._id !== id) {
				if (window.confirm('Are you sure you want to delete this account ? ')) {
					setLoading(true);
					await axios.delete(`/user/delete/${id}`, {
						headers: { Authorization: token }
					});

					setLoading(false);
					setCallback(!callback);
				}
			}
		} catch (error) {
			setData({ ...data, err: error.response.data.msg, success: '' });
		}
	};
	return (
		<>
			<div>
				{err && showErrMsg(err)}
				{success && showSuccessMsg(success)}
				{loading && <h3>Loading .....</h3>}
			</div>
			<div className='profile_page'>
				<div className='col-left'>
					<h2>User Profile</h2>
					<div className='avatar'>
						<img src={avatar ? avatar : user.avatar} alt='' />
						<span>
							<i className='fas fa-camera'></i>
							<p>Change</p>
							<input
								type='file'
								name='file'
								id='file_up'
								onChange={changeAvatar}
							/>
						</span>
					</div>
					<div className='form-group'>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							name='name'
							id='name'
							defaultValue={user.name}
							placeholder='Your name'
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							name='email'
							id='email'
							defaultValue={user.email}
							placeholder='Your email'
							disabled
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='password'>New Password</label>
						<input
							type='password'
							name='password'
							id='password'
							value={password}
							placeholder='Your password'
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='cf_password'>Confirm Password</label>
						<input
							type='password'
							name='cf_password'
							id='cf_password'
							value={cf_password}
							placeholder='Confirm password'
							onChange={handleChange}
						/>
					</div>
					<div>
						<em style={{ color: 'crimson' }}>
							* If you update your password here, you will not be able to login
							quickly using google and facebook.
						</em>
					</div>
					<button disabled={loading} onClick={handleUpdate}>
						Update
					</button>
				</div>
				<div className='col-right'>
					<h2>{isAdmin ? 'Users' : 'My Orders'}</h2>
					<div style={{ overflowX: 'auto' }}>
						<table className='customers'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>Admin</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr key={user._id}>
										<td>{user._id}</td>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td>
											{user.role === 1 ? (
												<i className='fas fa-check' title='Admin'></i>
											) : (
												<i className='fas fa-times' title='User'></i>
											)}
										</td>
										<td>
											<Link to={`edit_user/${user._id}`}>
												<i className='fas fa-edit' title='Edit'></i>
											</Link>
											<i
												className='fas fa-trash-alt'
												title='Delete'
												onClick={() => handleDelete(user._id)}
											></i>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}

export default Profile;
