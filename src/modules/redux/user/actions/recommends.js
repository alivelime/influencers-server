export const loadRecommends = userId => ({
	type: 'LOAD_RECOMMENDS',
	userId,
});

export const addRecommend = recommend => ({
	type: 'ADD_RECOMMEND',
	recommend,
})

export const updateRecommend = recommend => ({
	type: 'UPDATE_RECOMMEND',
	recommend,
})


