import { call, put } from 'redux-saga/effects'
import { postAPI, patchAPI, deleteAPI } from 'modules/utils/Request';

export function* add(action) {
	const res = yield call(postAPI, `/api/recommend-branches`, action.data, action.token);
	if (Object.keys(res).length > 0) {
		yield put({type: "ADD_RECOMMEND_BRANCH_SUCCEEDED", data: res});
		return res;
	} else {
		yield put({type: "ADD_RECOMMEND_BRANCH_FAILED", data: res});
		return {};
	}

	return {};
}
export function addSub(action) {
	throw Error("use addRecommendBranch.");
}
export function moveUp(action) {
	throw Error("use action creator.");
}
export function moveDown(action) {
	throw Error("use action creator.");
}
export function move(action) {
	throw Error("use action creator.");
}
export function deleteOne(action) {
	throw Error("use action creator.");
}
export function updateOne(action) {
	throw Error("use action creator.");
}

export function* updateMulti(action) {
	let res = [];
	yield Promise.all(
		action.data.map((data) => {
			return (async () => {
				res.push(await patchAPI(`/api/recommend-branches/${data.id}`, data, token));
			})()
		})
	);

	yield put({type: "UPDATE_RECOMMEND_BRANCHES_SUCCEEDED", data: res});
}
export function* deleteMulti(action) {
	action.ids.forEach(async (id) => {
		// call one by one. do not call concurrency. data will be broken.
		await call(deleteAPI, `/api/recommend-branches/${id}`, token);
	});
	yield put({type: "DELETE_RECOMMEND_BRANCH_SUCCEEDED", ids: action.ids});
}

