export const addReview = (recommendBranchId, isRecommend, {review, recommend, evidence, recommendBranches}) => ({
	type: 'ADD_REVIEW_REQUEST',
	recommendBranchId,
	isRecommend,
	review,
	recommend,
	evidence,
	recommendBranches,
})

export const addEvidence = data => ({
	type: 'ADD_RECOMMEND_REQUEST',
	data,
})

