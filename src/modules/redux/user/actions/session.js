export const fetchSexxion = (sns, token) => ({
	type: 'FETCH_SESSION_USER_REQUEST',
	sns,
	token,
});

export const registerUser = (sns, token) => ({
	type: 'REGISTER_USER_REQUEST',
	sns,
	token,
});


