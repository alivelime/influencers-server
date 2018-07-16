export const addReview = (recommendBranchId, isRecommend, {review, recommend, evidence, recommendBranches}, token) => ({
	type: 'ADD_REVIEW_REQUEST',
	recommendBranchId,
	isRecommend,
	review,
	recommend,
	evidence,
	recommendBranches,
})

export const addEvidence = (data, token) => ({
	type: 'ADD_RECOMMEND_REQUEST',
	data,
	token,
})

