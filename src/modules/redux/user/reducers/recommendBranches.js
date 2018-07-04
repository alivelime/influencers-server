export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
			return action.recommendBranches;

		case 'ADD_RECOMMEND_BRANCH_SUCCEEDED':
		{
			let recommendBranches = Object.assign({}, state);
			let data = action.data;
			recommendBranches[data.id] = data;

			// set nextId of prev branch.
			if (data.prevId !== "0") {
				recommendBranches[data.prevId].nextId = data.id;
			}
			// set prevId of next branch.
			if (data.nextId !== "0") {
				recommendBranches[data.nextId].prevId = data.id;
			}

			return recommendBranches;
		}
			
		case 'UPDATE_RECOMMEND_BRANCH_SUCCEEDED':
			throw Error('use UPDATE_RECOMMEND_BRANCHES');
			
		case 'UPDATE_RECOMMEND_BRANCHES_SUCCEEDED':
		{
			let recommendBranches = Object.assign({}, state);
			action.data.forEach((data) => {
				recommendBranches[data.id] = data;
			});
			return recommendBranches;
		}	
		case 'DELETE_RECOMMEND_BRANCHES_SUCCEEDED':
			throw Error("yet no implement.");

		case 'OPEN_RECOMMEND_BRANCH':
			return Object.assign({}, state, {
				[action.id]: {...state[action.id], isOpen: true}
			});
		case 'CLOSE_RECOMMEND_BRANCH':
			return Object.assign({}, state.recommendBranches, {
				[action.id]: {...state[action.id], isOpen: false}
			});

		// use action instead.
		case 'MOVE_UP_RECOMMEND_BRANCH_REQUEST':
		case 'MOVE_DOWN_RECOMMEND_BRANCH_REQUEST':
		case 'MOVE_RECOMMEND_BRANCHES_REQUEST':
			throw Error("use action creator.");

		// ignore. handle with checker.js
		case 'CHECK_RECOMMEND_BRANCH':

		// implement sagas/recommendBranches.js
		case 'ADD_RECOMMEND_BRANCH_REQUEST':
		case 'UPDATE_RECOMMEND_BRANCHES_REQUEST':
		case 'DELETE_RECOMMEND_BRANCHES_REQUEST':
		default:
			return state;
	}
};

