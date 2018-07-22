export const addReview = (recommendBranchId, isRecommend, {review, recommend, evidence, recommendBranches}, token) => ({
	type: 'ADD_REVIEW_REQUEST',
	recommendBranchId,
	isRecommend,
	review,
	recommend,
	evidence,
	recommendBranches,
	token,
})

