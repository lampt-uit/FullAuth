import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ActivationEmail from './auth/ActivationEmail';
import Login from './auth/Login';
import Register from './auth/Register';
import NotFound from '../utils/notfound/NotFound';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Profile from './profile/Profile';

function Body() {
	const auth = useSelector((state) => state.auth);
	const { isLogged } = auth;
	return (
		<section>
			<Switch>
				<Route
					path='/login'
					component={isLogged ? NotFound : Login}
					exact
				></Route>
				<Route
					path='/register'
					component={isLogged ? NotFound : Register}
					exact
				></Route>
				<Route
					path='/user/activate/:activation_token'
					component={ActivationEmail}
					exact
				></Route>

				<Route
					path='/user/reset/:token'
					component={ResetPassword}
					exact
				></Route>

				<Route
					path='/forgot_password'
					component={isLogged ? NotFound : ForgotPassword}
					exact
				></Route>

				<Route
					path='/profile'
					component={isLogged ? Profile : NotFound}
					exact
				></Route>
			</Switch>
		</section>
	);
}

export default Body;
