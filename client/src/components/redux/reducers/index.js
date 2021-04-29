import { combineReducers } from 'redux';

import auth from './auth.reducer';
import token from './token.reducer';
import users from './user.reducer';

export default combineReducers({
	auth,
	token,
	users
});
