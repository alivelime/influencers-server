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


