
const init = {
	affiliate: {},
	followIds: [],
	followerIds: [],
};
export default (state = init, action) => {
	switch (action.type) {
		case 'LOAD_USER_REQUEST':
			return state;
		case 'LOAD_USER_SUCCEEDED':
			return {...state, ...action.data};
		case 'CLEAR_USER':
			return init;
		case 'LOAD_USER_AFFILIATE_SUCCEEDED':
			return {...state, affiliate: action.data};
		case 'CLEAR_USER_AFFILIATE':
			return {...state, affiliate: {}};
		case 'LOAD_USER_FAILED':
			return {...init, id: "0", name: "no user"};
		case 'UPDATE_USER_REQUEST':
			return state;
		case 'UPDATE_USER_SUCCEEDED':
			return {...state, ...action.data};
		case 'UPDATE_USER_AFFILIATE_SUCCEEDED':
			return {...state, affiliate: action.data};
		case 'UPDATE_USER_FAILED':
			return {...init, id: "0", name: "update error"};
		case 'LOAD_USER_FOLLOWS_SUCCEEDED':
			return {...state, followIds: action.data};
		case 'LOAD_USER_FOLLOWERS_SUCCEEDED':
			return {...state, followerIds: action.data};
		case 'FOLLOW_USER_SUCCEEDED':
			return {...state, followerIds: [...state.followerIds, action.id]};
		case 'UNFOLLOW_USER_SUCCEEDED':
			return {...state, followerIds: state.followerIds.filter(id => id !== action.id)};
		default:
			return state;
	}
};

