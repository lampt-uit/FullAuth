import { combineReducers } from 'redux';

import auth from './auth.reducer';
import token from './token.reducer';

export default combineReducers({
	auth,
	token
});
