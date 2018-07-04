export const addReview = (recommendBranchId, isRecommend, recommend, review) => ({
	type: 'ADD_REVIEW_REQUEST',
	recommendBranchId,
	isRecommend,
	review,
})

export const addEvidence = data => ({
	type: 'ADD_RECOMMEND_REQUEST',
	data,
})

