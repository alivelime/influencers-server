
export const setRecommendBranchId = (id, isRecommend = false) => ({
	type: 'SET_RECOMMEND_BRANCH_ID',
	id,
	isRecommend,
})

export const previewRecommend = url => ({
	type: 'PREVIEW_RECOMMEND',
	url,
})

export const previewEvidence = url => ({
	type: 'PREVIEW_REVIEW',
	url,
})


