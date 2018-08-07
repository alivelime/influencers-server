
const init = {
	affiliate: {},
	follows: {},
	followers: {},
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
			return {...state, follows: action.data};
		case 'LOAD_USER_FOLLOWS_FAILED':
			return {...state, follows: {}};
		case 'LOAD_USER_FOLLOWERS_SUCCEEDED':
			return {...state, followers: action.data};
		case 'LOAD_USER_FOLLOWERS_FAILED':
			return {...state, followers: {}};
		case 'FOLLOW_USER_SUCCEEDED':
			console.log({...state, followers: {...state.followers, [action.data.id]: action.data}});
			return {...state, followers: {...state.followers, [action.data.id]: action.data}};
		case 'UNFOLLOW_USER_SUCCEEDED':
			let users = {...state};
			delete users.followers[action.id];
			console.log(users);
			return users;
		case 'ADD_REVIEW_SUCCEEDED':
			if (action.review.iineId !== "0") {
				return {...state, iineCount: Number(state.iineCount)+1};
			} else {
				return {...state, iiyoCount: Number(state.iiyoCount)+1};
			}
		default:
			return state;
	}
};

