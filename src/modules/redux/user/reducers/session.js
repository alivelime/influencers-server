// import {debug} from 'config'

const empty = {state: '', user: {}, token: ''};

export default (state = empty, action) => {
	switch (action.type) {
		case 'FETCH_LOGIN_USER_SUCCEEDED':
			return {
				state: (action.data.id !== "0" ? "login" : "register"),
				user: action.data,
				token: action.token,
			}

		case 'REGISTER_USER_SUCCEEDED':
			return {state: 'login', user: action.data, token: action.token}

		case 'REGISTER_USER_FAILED':
			return {state: 'failed', user: {}, token: ''}

		case 'LEAVE_USER_SUCCEEDED':
			return {state: '', user: {}, token: ''}

		case 'LOGOUT':
			return {state: '', user: {}, token: ''}

		default:
			return state;
	}
};


