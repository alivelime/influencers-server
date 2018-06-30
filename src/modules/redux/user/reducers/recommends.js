export default (state, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
		case 'ADD_RECOMMEND_SUCCEEDED':
			return {...state.recommends, [action.data.url]: action.data};

		case 'DELETE_RECOMMEND_SUCCEEDED':
			let recommends = state.recommends;
			delete recommends[action.url];

		case 'LOAD_USER_RECOMMEND_DATA_FAILED':
		default:
			return state.recommends;
	}
};


