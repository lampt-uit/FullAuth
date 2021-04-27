import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Header() {
	//Get state auth
	const auth = useSelector((state) => state.auth);

	const { user, isLogged } = auth;

	const handleLogout = async () => {
		try {
			await axios.get('/user/logout');
			localStorage.removeItem('firstLogin');
			window.location.href = '/';
		} catch (error) {
			window.location.href = '/';
		}
	};

	const userLink = () => {
		return (
			<li className='drop-nav'>
				<Link to='#' className='avatar'>
					<img src={user.avatar} alt='/' />
					&nbsp;
					{user.name} <i className='fas fa-angle-down'></i>
				</Link>
				<ul className='dropdown'>
					<li>
						<Link to='/profile'>Profile</Link>
					</li>
					<li>
						<Link to='/logout' onClick={handleLogout}>
							Logout
						</Link>
					</li>
				</ul>
			</li>
		);
	};

	return (
		<header>
			<div className='logo'>
				<h1>
					<Link to='/'>LS✮SHOP</Link>
				</h1>
			</div>
			<ul>
				<li>
					<Link to='/'>
						<i className='fas fa-shopping-cart'></i>&nbsp;Cart
					</Link>
				</li>
				{isLogged ? (
					userLink()
				) : (
					<li>
						<Link to='/login'>
							<i className='fas fa-user'></i>&nbsp;Sign In
						</Link>
					</li>
				)}
			</ul>
		</header>
	);
}

export default Header;
