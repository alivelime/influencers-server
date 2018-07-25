export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
			return action.recommendBranches || state;
		case 'LOAD_USER_RECOMMEND_DATA_FAILED':
			return {"-1": {name: "no data", parentId: "0", prevId: "0", nextId:"0"}};

		case 'ADD_RECOMMEND_BRANCH_SUCCEEDED':
		{
			let recommendBranches = Object.assign({}, state);
			let data = action.data;
			recommendBranches[data.id] = {...data, isOpne: true};

			// do not set prev and next branch id. use instead patch on sagas.

			return recommendBranches;
		}
		case 'ADD_REVIEW_SUCCEEDED':
		{
			if (!action.addRecommendBranch) return state;

			let recommendBranches = Object.assign({}, state);
			recommendBranches[action.addRecommendBranch.id] = {...action.addRecommendBranch, isOpen: true};
			recommendBranches[action.patch.id] = Object.assign({}, state[action.patch.id], action.patch);

			return recommendBranches;
		}
			
		case 'UPDATE_RECOMMEND_BRANCH_SUCCEEDED':
			throw Error('use UPDATE_RECOMMEND_BRANCHES');
			
		case 'UPDATE_RECOMMEND_BRANCHES_SUCCEEDED':
		{
			let recommendBranches = Object.assign({}, state);
			action.data.forEach((data) => {
				recommendBranches[data.id] = {...data, isOpen: state[data.id].isOpen};
			});
			return recommendBranches;
		}	
		case 'DELETE_RECOMMEND_BRANCHES_SUCCEEDED':
			throw Error("yet no implement.");

		case 'OPEN_RECOMMEND_BRANCH':
			return {
				...state,
				[action.id]: {...state[action.id], isOpen: true},
			};
		case 'CLOSE_RECOMMEND_BRANCH':
			return {
				...state,
				[action.id]: {...state[action.id], isOpen: false},
			};
		case 'OPEN_ALL_RECOMMEND_BRANCHES':
		{
			let ret = {};
			Object.keys(state).forEach((id) => {
				ret[id] = Object.assign({}, state[id]); 
				ret[id].isOpen = true;
			});
			return ret;
		}
		case 'CLOSE_ALL_RECOMMEND_BRANCHES':
		{
			let ret = {};
			Object.keys(state).forEach((id) => {
				ret[id] = Object.assign({}, state[id]); 
				ret[id].isOpen = false;
			});
			return ret;
		}
		// use action instead.
		case 'MOVE_UP_RECOMMEND_BRANCH_REQUEST':
		case 'MOVE_DOWN_RECOMMEND_BRANCH_REQUEST':
		case 'MOVE_RECOMMEND_BRANCHES_REQUEST':
			throw Error("use action creator.");

		case 'CHECK_RECOMMEND_BRANCH': // ignore. handle with checker.js
		case 'ADD_RECOMMEND_BRANCH_REQUEST': // implement sagas/recommendBranches.js
		case 'UPDATE_RECOMMEND_BRANCHES_REQUEST':
		case 'DELETE_RECOMMEND_BRANCHES_REQUEST':
		default:
			return state;
	}
};

