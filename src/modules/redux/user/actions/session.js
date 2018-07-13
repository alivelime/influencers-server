export const fetchLoginUser = (sns, token) => ({
	type: 'FETCH_LOGIN_USER_REQUEST',
	sns,
	token,
});

export const registerUser = (sns, token) => ({
	type: 'REGISTER_USER_REQUEST',
	sns,
	token,
});


export const logout = (sns, token) => ({
	type: 'LOGOUT',
});

