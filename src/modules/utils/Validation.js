
function isURL(string) {
	return /^https?:\/\//.test(string);
}

export { isURL };
