import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';

function Body() {
	return (
		<section>
			<Switch>
				<Route path='/login' component={Login} exact></Route>
				<Route path='/register' component={Register} exact></Route>
			</Switch>
		</section>
	);
}

export default Body;
