import ACTIONS from '../actions/index';
const user = [];

const userReducer = (state = user, action) => {
	switch (action.type) {
		case ACTIONS.GET_ALL_USERS:
			return action.payload;

		default:
			return state;
	}
};

export default userReducer;
