
export default (state = [], action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND':
			// use form plugin.
			break;

		case 'CHECK_RECOMMEND_BRANCH':
			// use form plugin.
			return {...state.reviewForm, recommendBranchId: action.recommendBranchId);
			
		case 'UNCHECK_RECOMMEND':
			return {...state.reviewForm, recommendBranchId: "0"};

		case 'UNCHECK_RECOMMEND_BRANCH':
			return {...state.reviewForm, recommendBranchId: "0"};

		case 'PREVIEW_RECOMMEND_REQUEST':
			return {...state.reviewForm, recommendPreview: action.data};

		case 'PREVIEW_EVIDENCE_REQUEST':
			return {...state.reviewForm, evidencePreview: action.data};

		default:
			return state.reviewForm;
	}
};
