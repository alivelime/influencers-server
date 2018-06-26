
// user

export const loadUser = id => ({
	type: 'LOAD_USER',
	id,
});

export const registerUser = data => ({
	type: 'REGISTER_USER',
	data,
});

export const updateUser = data => ({
	type: 'UPDATE_USER',
	data,
})

// user recommend branche

export const loadRecommendBranches = userId => ({
	type: 'LOAD_RECOMMEND_BRANCHES',
	userId,
});

export const addRecommendBranch = recommendBranch => ({
	type: 'ADD_RECOMMEND_BRANCH',
	recommendBranch,
})

export const updateRecommendBranch = recommendBranch => ({
	type: 'UPDATE_RECOMMEND_BRANCH',
	recommendBranch,
})

export const deleteRecommendBranch = id => ({
	type: 'DELETE_RECOMMEND_BRANCH',
	id,
})

export const moveUpRecommendBranch = id => ({
	type: 'MOVEUP_RECOMMEND_BRANCH',
	id,
})

export const moveDownRecommendBranch = id => ({
	type: 'MOVEDOWN_RECOMMEND_BRANCH',
	id,
})

export const moveRecommendBranch = (ids, to) => ({
	type: 'MOVE_RECOMMEND_BRANCH',
	ids,
	to,
})

export const loadRecommends = userId => ({
	type: 'LOAD_RECOMMENDS',
	userId,
});

export const addRecommend = recommend => ({
	type: 'ADD_RECOMMEND',
	recommend,
})

export const updateRecommend = recommend => ({
	type: 'UPDATE_RECOMMEND',
	recommend,
})

export const addReview = review => ({
	type: 'ADD_REVIEW',
	review,
})

export const updateReview = review => ({
	type: 'UPDATE_REVIEW',
	review,
})


// ReviewForm

export const setRecommendBranchId = id => ({
	type: 'SET_RECOMMEND_BRANCH_ID',
	id,
})

export const setRecommendURL = url => ({
	type: 'SET_RECOMMEND_URL',
	url,
})

export const setReviewURL = url => ({
	type: 'SET_REVIEW_URL',
	url,
})

export const previewRecommend = recommend => ({
	type: 'PREVIEW_RECOMMEND',
	recommend,
})

export const previewReview = review => ({
	type: 'PREVIEW_REVIEW',
	review,
})


