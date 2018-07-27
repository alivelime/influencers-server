


export const getAPI = (path, token) => {
	return requestAPI('GET', path, null, token);
}

export const postAPI = (path, data, token) => {
	return requestAPI('POST', path, data, token);
}

export const putAPI = (path, data, token) => {
	return requestAPI('PUT', path, data, token);
}

export const patchAPI = (path, data, token) => {
	return requestAPI('PATCH', path, data, token);
}

export const deleteAPI = (path, token) => {
	return requestAPI('DELETE', path, null, token);
}

export const requestAPI = (method, path, data = null, token = '') => {
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	if (token && token.length > 0) {
		myHeaders.append('Authenticate', `Bearer ${token}`);
	}
	return fetch(path, {
		method: method,
		headers: myHeaders,
		body: (data ? JSONstring2int64(data) : undefined),
		mode: 'cors',
		cache: 'no-cache' })
	.then((response) => {
			if (!response.ok) {
				return "{}";
			}
			return response.text();
	})
	.then((res) => {
		return new Promise((resolve, reject) => {
			if (res.length > 0) {
				resolve(JSONint642string(res));
			} else {
				resolve({});
			}
		});
	});
}

// strip "". ex "1234" => 1234
function JSONstring2int64(data) {
	return JSON.stringify(data).replace(/"([0-9]+)"/g, '$1');
}
// quote with "". ex "key":1234, => "key":"1234"
function JSONint642string(data) {
	const str = data.replace(/([0-9]+)([,}\]])/g, '"$1"$2')
	return JSON.parse(str, (key, val) => {
		// parse date
		if (typeof(val) === "string" &&
				val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/)){
				return new Date(Date.parse(val));
		}
		return val;
	});
}

export const base64encode = (string) => {
	return btoa(unescape(encodeURIComponent(string)));
}
