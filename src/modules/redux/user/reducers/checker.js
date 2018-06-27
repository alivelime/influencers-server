
export default (state = [], action) => {
	switch (action.type) {
		case 'CHECK_RECOMMEND':
		case 'CHECK_RECOMMEND_BRANCH':
		case 'UNCHECK_ALL':
		default:
			return state;
	}
};


