export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
			return action.recommends;

		case 'GET_RECOMMEND_PREVIEW_SUCCEEDED':
		case 'GET_EVIDENCE_PREVIEW_SUCCEEDED':
		case 'ADD_RECOMMEND_SUCCEEDED':
			return {...state, [action.data.url]: action.data};

		case 'ADD_REVIEW_SUCCEEDED':
			const evidence = (action.evidence ? {[action.evidence.url]: action.evidence} : null);
			return {...state,
				[action.recommend.url]: action.recommend,
				evidence,
			};

		case 'DELETE_RECOMMEND_SUCCEEDED':
			let recommends = Object.assign({}, state);
			delete recommends[action.url];
			return recommends;

		case 'LOAD_USER_RECOMMEND_DATA_FAILED':
		default:
			return state;
	}
};


