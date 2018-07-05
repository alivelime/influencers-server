export const checkRecommendBranch = (id) => ({
	type: 'CHECK_RECOMMEND_BRANCH',
	id,
});

export const uncheckRecommendBranch = (id) => ({
	type: 'UNCHECK_RECOMMEND_BRANCH',
	id,
});

export const checkRecommend = (id, url) => ({
	type: 'CHECK_RECOMMEND',
	id,
	url,
});

export const uncheckRecommend = (id) => ({
	type: 'UNCHECK_RECOMMEND',
	id,
});

export const uncheckAll = () => ({
	type: 'UNCHECK_ALL',
});


