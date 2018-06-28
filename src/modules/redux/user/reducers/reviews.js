export default (state = [], action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA':
			Object.keys(action.reviews).forEach((id) => {
				action.reviews[id]["meta"] = action.recommends[action.reviews[id].evidence];
			});
			return action.reviews;

		case 'ADD_REVIEW':
		case 'DELETE_REVIEW':
		default:
			return state;
	}
};



