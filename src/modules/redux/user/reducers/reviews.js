export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
			return action.reviews || state;

		case 'ADD_REVIEW_SUCCEEDED':
			return {...state, [action.review.id]: action.review};

		case 'ADD_RECOMMEND_SUCCEEDED':
			return state;

		case 'DELETE_REVIEW_SUCCEEDED':
			let reviews = Object.assign({}, state);
			delete reviews[action.id];
			return reviews;

		case 'CLEAR_USER_RECOMMEND_DATA':
			return {};

		default:
			return state;
	}
};



