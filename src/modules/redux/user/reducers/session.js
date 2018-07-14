
export default (state = {state: '', user: {}}, action) => {
	switch (action.type) {
		case 'FETCH_LOGIN_USER_SUCCEEDED':
			return {
				state: (action.data.id !== "0" ? "login" : "register"),
				user: action.data
			}

		case 'LOAD_USER_FAILED':
			return {state: 'failed', user: {}}

		case 'REGISTER_USER_SUCCEEDED':
			return {state: 'login', user: action.data}

		case 'REGISTER_USER_FAILED':
			return {state: 'failed', user: {}}

		default:
			return state;
	}
};


