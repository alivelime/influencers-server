
export const setRecommendBranchId = (id, isRecommend = false) => ({
	type: 'SET_RECOMMEND_BRANCH_ID',
	id,
	isRecommend,
})

export const getRecommendPreview = url => ({
	type: 'GET_PREVIEW_REQUEST',
	callback: 'GET_RECOMMEND_PREVIEW_SUCCEEDED',
	url,
})

export const getEvidencePreview = url => ({
	type: 'GET_PREVIEW_REQUEST',
	callback: 'GET_EVIDENCE_PREVIEW_SUCCEEDED',
	url,
})

export const clearURL = url => ({
	type: 'REVIEW_FORM_CLEAR_URL',
})

export const clearEvidence = url => ({
	type: 'REVIEW_FORM_CLEAR_EVIDENCE',
})

export const clearMemo = url => ({
	type: 'REVIEW_FORM_CLEAR_MEMO',
})

export const fetchIineReview = id => ({
	type: 'FETCH_IINE_REVIEW_REQUEST',
	id,
})

export const clearReviewForm = () => ({
	type: 'CLEAR_REVIEW_FORM',
})


