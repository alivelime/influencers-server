export const addReview = (recommendBranchId, isRecommend, recommend, review) => ({
	type: 'ADD_REVIEW_REQUEST',
	recommendBranchId,
	isRecommend,
	recommend,
	review,
})

export const addEvidence = data => ({
	type: 'ADD_REVIEW_REQUEST',
	data,
})

