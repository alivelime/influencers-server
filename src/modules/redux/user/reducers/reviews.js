export default (state = [], action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA':
			Object.keys(action.reviews).forEach((id) => {
				action.reviews[id]["meta"] = action.recommends[action.reviews[id].evidence];
			});
			return action.reviews;

		case 'ADD_REVIEW_SUCCEEDED':
			return {...state.reviews, [action.data.id]: action.data};

		case 'ADD_RECOMMEND_SUCCEEDED':
			Object.keys(state).forEach((id) => {
				if (state[id].evidence === action.data.url) {
					state[id]["meta"] = action.data;
				}
			});
			return state;

		case 'DELETE_REVIEW_SUCCEEDED':
			let reviews = Object.assign({}, state.reviews);
			delete reviews[action.id];
			return reviews;

		default:
			return state;
	}
};



