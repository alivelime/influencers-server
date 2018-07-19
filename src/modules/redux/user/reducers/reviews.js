export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
			Object.keys(action.reviews).forEach((id) => {
				action.reviews[id]["meta"] = action.recommends[action.reviews[id].evidence];
			});
			return action.reviews || state;

		case 'ADD_REVIEW_SUCCEEDED':
			return {...state, [action.review.id]: action.review};

		case 'ADD_RECOMMEND_SUCCEEDED':
			Object.keys(state).forEach((id) => {
				if (state[id].evidence === action.data.url) {
					state[id]["meta"] = action.data;
				}
			});
			return state;

		case 'DELETE_REVIEW_SUCCEEDED':
			let reviews = Object.assign({}, state);
			delete reviews[action.id];
			return reviews;

		default:
			return state;
	}
};



