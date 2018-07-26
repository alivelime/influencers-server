export const loadUser = id => ({
	type: 'LOAD_USER_REQUEST',
	id,
});

export const clearUser = () => ({
	type: 'CLEAR_USER',
});

export const registerUser = data => ({
	type: 'REGISTER_USER',
	data,
});

export const updateUser = (id, data, token) => ({
	type: 'UPDATE_USER_REQUEST',
	id,
	data,
	token,
})

export const loadAffiliate = id => ({
	type: 'LOAD_USER_AFFILIATE_REQUEST',
	id,
});

export const clearAffiliate = () => ({
	type: 'CLEAR_USER_AFFILIATE',
});

export const updateAffiliate = (id, data, token) => ({
	type: 'UPDATE_USER_AFFILIATE_REQUEST',
	id,
	data,
	token,
})

export const deleteUser = (id, data, token) => ({
	type: 'DELETE_USER_REQUEST',
	data,
	token,
})

export const loadUserRecommendData = (id, token = null) => ({
	type: 'LOAD_USER_RECOMMEND_DATA_REQUEST',
	id,
	token,
});

export const clearUserRecommendData = () => ({
	type: 'CLEAR_USER_RECOMMEND_DATA',
});


