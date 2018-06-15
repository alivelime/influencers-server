


function getAPI(path) {
	return requestAPI('GET', path);
}

function postAPI(path, data) {
	return requestAPI('POST', path, data);
}

function putAPI(path, data) {
	return requestAPI('PUT', path, data);
}

function patchAPI(path, data) {
	return requestAPI('PATCH', path, data);
}

function deleteAPI(path) {
	return requestAPI('DELETE', path);
}

function requestAPI(method, path, data = null) {
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
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
	const str = data.replace(/:([0-9]+)([,}])/g, ':"$1"$2')
	console.log(str);
	return JSON.parse(str, (key, val) => {
		// parse date
		if (typeof(val) === "string" &&
				val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/)){
		console.log("date matched!!!!");
				return new Date(Date.parse(val));
		}
		return val;
	});
}

export { getAPI, postAPI, deleteAPI, putAPI, patchAPI }
