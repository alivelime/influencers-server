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

export const loadUserFollow = id => ({
	type: 'LOAD_USER_FOLLOWS_REQUEST',
	id,
});

export const loadUserFollower = id => ({
	type: 'LOAD_USER_FOLLOWERS_REQUEST',
	id,
});

export const followUser = (i,u, user, token) => ({
	type: 'FOLLOW_USER_REQUEST',
	i,
	u,
	user,
	token,
});

export const unfollowUser = (i, u, token) => ({
	type: 'UNFOLLOW_USER_REQUEST',
	i,
	u,
	token,
});

