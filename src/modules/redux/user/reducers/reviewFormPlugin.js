
export default (state, action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND':
			return {...state, values: {...state.values, url: action.url}};

		case 'UNCHECK_RECOMMEND':
			return {...state, values: {...state.values, url: ''}};

		case 'REVIEW_FORM_CLEAR_URL':
			return {...state, values: {...state.values, url: ''}};

		case 'REVIEW_FORM_CLEAR_EVIDENCE':
			return {...state, values: {...state.values, evidence: ''}};

		case 'CHECK_RECOMMEND_BRANCH':
		case 'UNCHECK_RECOMMEND_BRANCH':
		case 'UNCHECK_ALL':
		default:
			return state;
	}
};

