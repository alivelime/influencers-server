
export const loadRecommendBranches = userId => ({
	type: 'LOAD_RECOMMEND_BRANCHES',
	userId,
});

export const addRecommendBranch = id => ({
	type: 'ADD_RECOMMEND_BRANCH_REQUEST',
	id,
})

export const addSubRecommendBranch = id => ({
	type: 'ADD_SUB_RECOMMEND_BRANCH_REQUEST',
	id,
})

export const deleteRecommendBranches = ids => ({
	type: 'DELETE_RECOMMEND_BRANCHES_REQUEST',
	id,
})

export const moveUpRecommendBranch = id => ({
	type: 'MOVE_UP_RECOMMEND_BRANCH_REQUEST',
	id,
})

export const moveDownRecommendBranch = id => ({
	type: 'MOVE_DOWN_RECOMMEND_BRANCH_REQUEST',
	id,
})

export const moveRecommendBranch = (ids, to) => ({
	type: 'MOVE_RECOMMEND_BRANCHES_REQUEST',
	ids,
	to,
})

export const updateRecommendBranch = data => ({
	type: 'UPDATE_RECOMMEND_BRANCH_REQUEST',
	data,
})


