
export default (state = {isRecommend: false, recommendBranchId: "0", iineComplete: false}, action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND':
			// use form plugin to change url.
			return {isRecommend: true,  recommendBranchId: action.id};

		case 'CHECK_RECOMMEND_BRANCH':
			return {isRecommend: false, recommendBranchId: action.id};
			
		case 'UNCHECK_RECOMMEND':
			return {isRecommend: false, recommendBranchId: "0"};

		case 'UNCHECK_RECOMMEND_BRANCH':
			return {isRecommend: false, recommendBranchId: "0"};

		case 'UNCHECK_ALL':
			return {isRecommend: false, recommendBranchId: "0"};

		case 'SET_RECOMMEND_BRANCH_ID':
			return {isRecommend: action.id !== "0" && action.isRecommend, recommendBranchId: action.id };

		case 'FETCH_IINE_REVIEW_SUCCEEDED':
			return {isRecommend: false, recommendBranchId: "0"};

		case 'CLEAR_REVIEW_FORM':
			return {isRecommend: false, recommendBranchId: "0"};

		case 'ADD_REVIEW_SUCCEEDED':
			return {isRecommend: false, recommendBranchId: "0", iineComplete: action.iineComplete};

		default:
			return state;
	}
};
