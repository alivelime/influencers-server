
export default (state = [], action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND':
			return {...state, url: action.url);

		case 'UNCHECK_RECOMMEND':
			return {...state, url: ''};

		case 'CHECK_RECOMMEND_BRANCH':
		case 'UNCHECK_RECOMMEND_BRANCH':
		default:
			return state;
	}
};

