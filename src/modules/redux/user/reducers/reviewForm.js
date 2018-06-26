
export default reviewForm = (state = [], action) => {
	switch (action.type) {
		case 'PREVIEW_RECOMMEND':
		case 'PREVIEW_REVIEW':
		case 'SET_RECOMMEND_BRANCH_ID':
		case 'SET_RECOMMEND_URL':
		case 'SET_REVIEW_URL':
		default:
			throw new Error("no defined method " + action.type);
	}
};
