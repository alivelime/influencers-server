
export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_REQUEST':
			return state;
		case 'LOAD_USER_SUCCEEDED':
			return action.data;
		case 'LOAD_USER_FAILED':
			return action.data;
		case 'REGISTER_USER':
			return state;
		case 'UPDATE_USER_REQUEST':
		case 'UPDATE_USER_SUCCEEDED':
			return action.data;
		case 'UPDATE_USER_FAILED':
			return action.data;
		default:
			return state;
	}
};

