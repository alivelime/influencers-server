export default (state = {}, action) => {
	switch (action.type) {
		case 'LOAD_USER_RECOMMEND_DATA_SUCCEEDED':
			return action.recommendBranches;

		case 'ADD_RECOMMEND_BRANCH_SUCCEEDED':
		{
			let recommendBranches = Object.assign({}, state.recommendBranches);
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
			return {...state.recommendBranches, [action.data.id]: action.data};
			
		case 'UPDATE_RECOMMEND_BRANCHES_SUCCEEDED':
		{
			let recommendBranches = Object.assign({}, state.recommendBranches);
			action.data.forEach((data) => {
				recommendBranches[data.id] = data;
			});
			return recommendBranches;
		}	
		case 'DELETE_RECOMMEND_BRANCHES_SUCCEEDED':

		case 'OPEN_RECOMMEND_BRANCH':
			return Object.assign({}, state.recommendBranches, {
				[action.id]: {isOpen: true}
			});
		case 'CLOSE_RECOMMEND_BRANCH':
			return Object.assign({}, state.recommendBranches, {
				[action.id]: {isOpen: false}
			});

		case 'CHECK_RECOMMEND_BRANCH': // ignore. handle with checker.js
		// implement sagas/recommendBranches.js
		case 'ADD_RECOMMEND_BRANCH_REQUEST':
		case 'UPDATE_RECOMMEND_BRANCH_REQUEST':
		case 'DELETE_RECOMMEND_BRANCH_REQUEST':
		case 'MOVEUP_RECOMMEND_BRANCH_REQUEST':
		case 'MOVEDOWN_RECOMMEND_BRANCH_REQUEST':
		case 'MOVE_RECOMMEND_BRANCHES_REQUEST':
		default:
			return state;
	}
};

