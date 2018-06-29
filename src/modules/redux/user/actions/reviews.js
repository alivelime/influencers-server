export const loadReviews = userId => ({
	type: 'LOAD_REVIEWS',
	userId,
});

export const addReview = review => ({
	type: 'ADD_REVIEW',
	review,
})

export const updateReview = review => ({
	type: 'UPDATE_REVIEW',
	review,
})


