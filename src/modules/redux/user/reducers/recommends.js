export default (state = [], action) => {
	switch (action.type) {
		case 'LOAD_RECOMMENDS':
		case 'ADD_RECOMMEND':
		case 'DELETE_RECOMMEND':
		default:
			return state;
	}
};


