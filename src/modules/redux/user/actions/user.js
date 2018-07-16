export const loadUser = id => ({
	type: 'LOAD_USER_REQUEST',
	id,
});

export const loadUserAffiliate = id => ({
	type: 'LOAD_USER_AFFILIATE_REQUEST',
	id,
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

export const updateUserAffiliate = (id, data, token) => ({
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


