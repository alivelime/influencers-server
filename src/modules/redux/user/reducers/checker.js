
export default (state = {recommendIds: [], recommendBranchIds: []}, action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND_BRANCH':
			return {
				recommendIds: state.recommendIds,
				recommendBranchIds: state.recommendBranchIds.push(action.id),
			};
		case 'UNCHECK_RECOMMEND_BRANCH':
			return {
				recommendIds: state.recommendIds,
				recommendBranchIds: state.recommendBranchIds.filter((id) => { return id !== action.id; })
			};

		case 'CHECK_RECOMMEND':
			return {
				recommendIds: state.recommendIds.push(action.id),
				recommendBranchIds: state.recommendBranchIds,
			};
		case 'UNCHECK_RECOMMEND':
			return {
				recommendIds: state.recommendIds.filter((id) => { return id !== action.id; }),
				recommendBranchIds: state.recommendBranchIds,
			};

		case 'UNCHECK_ALL':
			return {recommendBranchIds: [], recommendIds: []};

		default:
			return state;
	}
};


