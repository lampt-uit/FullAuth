import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
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
				<li>
					<Link to='/login'>
						<i className='fas fa-user'></i>&nbsp;Sign In
					</Link>
				</li>
			</ul>
		</header>
	);
}

export default Header;
