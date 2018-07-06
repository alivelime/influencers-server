export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
			return action.recommends;

		case 'ADD_RECOMMEND_SUCCEEDED':
			return {...state, [action.data.url]: action.data};

		case 'DELETE_RECOMMEND_SUCCEEDED':
			let recommends = Object.assign({}, state);
			delete recommends[action.url];
			return recommends;

		case 'LOAD_USER_RECOMMEND_DATA_FAILED':
		default:
			return state;
	}
};


