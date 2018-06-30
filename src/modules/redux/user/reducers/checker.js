
export default (state = {recommendIds: [], recommendId: []}, action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND_BRANCH':
			return Object.assign({}, state, {
				recommendBranchIds: state.checker.recommendBranchIds.push(action.id),
			};
		case 'UNCHECK_RECOMMEND_BRANCH':
			return state.checker.recommendBranchIds.filter((id) => { return id !== action.id; });

		case 'CHECK_RECOMMEND':
			return Object.assign({}, state, {
				recommendIds: state.checker.recommendIds.push(action.id),
			};
		case 'UNCHECK_RECOMMEND':
			return state.checker.recommendIds.filter((id) => { return id !== action.id; });

		case 'UNCHECK_ALL':
			return {recommendBranchIds: [], recommendIds: []};
		default:
			return state;
	}
};


