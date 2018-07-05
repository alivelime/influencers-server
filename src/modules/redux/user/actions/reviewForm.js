
export const setRecommendBranchId = (id, isRecommend = false) => ({
	type: 'SET_RECOMMEND_BRANCH_ID',
	id,
	isRecommend,
})

export const getPreview = url => ({
	type: 'GET_PREVIEW',
	url,
})

export const clearURL = url => ({
	type: 'REVIEW_FORM_CLEAR_URL',
})

export const clearEvidence = url => ({
	type: 'REVIEW_FORM_CLEAR_EVIDENCE',
})


