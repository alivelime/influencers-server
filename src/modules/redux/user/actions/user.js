export const loadUser = id => ({
	type: 'LOAD_USER_REQUEST',
	id,
});

export const registerUser = data => ({
	type: 'REGISTER_USER',
	data,
});

export const updateUser = data => ({
	type: 'UPDATE_USER_REQUEST',
	data,
})

export const loadUserRecommendData = id => ({
	type: 'LOAD_USER_RECOMMEND_DATA_REQUEST',
	id,
});


