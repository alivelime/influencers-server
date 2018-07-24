
export default (state = {isRecommend: false, recommendBranchId: "0"}, action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND':
			// use form plugin to change url.
			return {...state, isRecommend: true,  recommendBranchId: action.id};

		case 'CHECK_RECOMMEND_BRANCH':
			return {...state, isRecommend: false, recommendBranchId: action.id};
			
		case 'UNCHECK_RECOMMEND':
			return {...state, isRecommend: false, recommendBranchId: "0"};

		case 'UNCHECK_RECOMMEND_BRANCH':
			return {...state, isRecommend: false, recommendBranchId: "0"};

		case 'UNCHECK_ALL':
			return {...state, isRecommend: false, recommendBranchId: "0"};

		case 'SET_RECOMMEND_BRANCH_ID':
			return {...state, isRecommend: action.id !== "0" && action.isRecommend, recommendBranchId: action.id };

		case 'FETCH_IINE_REVIEW_SUCCEEDED':
			return {...state, isRecommend: false, recommendBranchId: "0"};

		default:
			return state;
	}
};
