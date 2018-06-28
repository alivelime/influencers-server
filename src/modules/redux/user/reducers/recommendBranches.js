export default (state = [], action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
		case 'LOAD_USER_RECOMMEND_DATA_FAILED':
			return action.recommendBranches;

		case 'ADD_RECOMMEND_BRANCH':
		case 'UPDATE_RECOMMEND_BRANCH':
		case 'DELETE_RECOMMEND_BRANCH':
		case 'MOVEUP_RECOMMEND_BRANCH':
		case 'MOVEDOWN_RECOMMEND_BRANCH':
		case 'MOVE_RECOMMEND_BRANCH':
		default:
			return state;
	}
};

