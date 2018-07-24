
export default (state, action) => {
	switch (action.type) {
		case 'GET_RECOMMEND_PREVIEW_SUCCEEDED':
			return {...state, values: {...state.values, url: action.data.url}};

		case 'GET_EVIDENCE_PREVIEW_SUCCEEDED':
			return {...state, values: {...state.values, evidence: action.data.url}};

		case 'CHECK_RECOMMEND':
			return {...state, values: {...state.values, url: action.url}};

		case 'UNCHECK_RECOMMEND':
			return {...state, values: {...state.values, url: ''}};

		case 'REVIEW_FORM_CLEAR_URL':
			return {...state, values: {...state.values, url: ''}};

		case 'REVIEW_FORM_CLEAR_EVIDENCE':
			return {...state, values: {...state.values, evidence: ''}};

		case 'REVIEW_FORM_CLEAR_MEMO':
			return {...state, values: {...state.values, memo: ''}};

		case 'FETCH_IINE_REVIEW_SUCCEEDED':
			return {...state, values: {...state.values, url: action.data.recommendId, kind: action.kind}};

		case 'CHECK_RECOMMEND_BRANCH':
		case 'UNCHECK_RECOMMEND_BRANCH':
		case 'UNCHECK_ALL':
		default:
			return state;
	}
};

