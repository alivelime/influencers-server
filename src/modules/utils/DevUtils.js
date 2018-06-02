


function getAPI(path, data = null, callback = null) {
	requestAPI('GET', path, data, callback);
}

function postAPI(path, data, callback = null) {
	requestAPI('POST', path, data, callback);
}

function putAPI(path, data, callback = null) {
	requestAPI('PUT', path, data, callback);
}

function patchAPI(path, data, callback = null) {
	requestAPI('PATCH', path, data, callback);
}

function deleteAPI(path) {
	requestAPI('DELETE', path);
}

function requestAPI(method, path, data = null, callback = null) {
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	fetch(path, {
		method: method,
		headers: myHeaders,
		body: (data ? JSONstring2int64(data) : undefined),
		mode: 'cors',
		cache: 'no-cache' })
	.then((response) => {
			return response.text();
	})
	.then((res) => {
		res = JSONint642string(res);
		if (typeof callback === "function") {
			callback(res);
		}
	});
}

// strip "". ex "1234" => 1234
function JSONstring2int64(data) {
	return JSON.stringify(data).replace(/"([0-9]+)"/g, '$1');
}
// quote with "". ex "key":1234, => "key":"1234"
function JSONint642string(data) {
	const str = data.replace(/:([0-9]+)([,}])/g, ':"$1"$2')
	console.log(str);
	return JSON.parse(str);
}

export { getAPI, postAPI, deleteAPI, putAPI, patchAPI }
