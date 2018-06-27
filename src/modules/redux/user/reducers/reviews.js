export default (state = [], action) => {
	switch (action.type) {
		case 'LOAD_REVIEWS':
		case 'ADD_REVIEW':
		case 'DELETE_REVIEW':
		default:
			return state;
	}
};



