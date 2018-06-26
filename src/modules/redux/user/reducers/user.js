
export default user = (state = [], action) => {
	switch (action.type) {
		case 'LOAD_USER':
		case 'REGISTER_USER':
		case 'UPDATE_USER':
		default:
			throw new Error("no defined method " + action.type);
	}
};

