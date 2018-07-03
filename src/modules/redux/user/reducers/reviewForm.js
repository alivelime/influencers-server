
export default (state = [], action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND':
			// use form plugin to change url.
			return {...state, recommendBranchId: action.id, isRecommend: true);

		case 'CHECK_RECOMMEND_BRANCH':
			return {...state, recommendBranchId: action.id, isRecommend: false);
			
		case 'UNCHECK_RECOMMEND':
			return {...state, recommendBranchId: "0", isRecommend: false};

		case 'UNCHECK_RECOMMEND_BRANCH':
			return {...state, recommendBranchId: "0", isRecommend: false};

		case 'SET_RECOMMEND_BRANCH_ID':
			return {...state, recommendBranchId: action.id, isRecommend: action.id !== "0" && action.isRecommend};

		case 'PREVIEW_RECOMMEND_REQUEST':
			return {...state, recommendPreview: action.data};

		case 'PREVIEW_EVIDENCE_REQUEST':
			return {...state, evidencePreview: action.data};

		default:
			return state;
	}
};
