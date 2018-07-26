export default (state = {state: "loading", users: {}, reviews: {}}, {type, data, users, reviews, recommends}) => {
	switch (type) {
		case 'LOAD_TIMELINE_REQUEST':
			return state;
		case 'LOAD_TIMELINE_SUCCEEDED':
			return {state: 'succeeded', data, users, reviews, recommends}
		case 'LOAD_TIMELINE_FAILED':
			return {state: 'failed', data:{i:[], u:[], follow:[]}}; 
		default:
			return state;
	}
};


