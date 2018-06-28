export default (state = [], action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
		case 'LOAD_USER_RECOMMEND_DATA_FAILED':
			return action.recommends;

		case 'ADD_RECOMMEND':
		case 'DELETE_RECOMMEND':
		default:
			return state;
	}
};


