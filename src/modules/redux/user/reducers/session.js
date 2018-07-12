
export default (state = {state: '', user: {}}, action) => {
	switch (action.type) {
		case 'FETCH_SESSION_USER_SUCCEEDED':
			return {state: action.data.state, user: action.data}

		case 'LOAD_USER_FAILED':
			return {state: 'failed', user: {}}

		case 'REGISTER_USER_SUCCEEDED':
			return {...state, state: 'login'}

		case 'REGISTER_USER_FAILED':
			return {state: 'failed', user: {}}

		default:
			return state;
	}
};


