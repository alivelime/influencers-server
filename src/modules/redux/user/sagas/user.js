import { call, put } from 'redux-saga/effects'
import { getAPI, patchAPI } from 'modules/utils/Request';

export function* fetch(action) {
	const res = yield call(getAPI, `/api/users/${action.id}`);

	if (Object.keys(res).length > 0) {
		yield put({type: "LOAD_USER_SUCCEEDED", data: res});
	} else {
		yield put({type: "LOAD_USER_FAILED"});
	}
}

export function* update(action) {
	const res = yield call(patchAPI, `/api/users/${action.id}`, action.data, action.token)

	if (Object.keys(res).length > 0) {
		yield put({type: "UPDATE_USER_SUCCEEDED", data: res});
	} else {
		yield put({type: "UPDATE_USER_FAILED"});
	}
}

export function* leave(action) {
	const res = yield call(patchAPI, `/api/users/${action.id}/leave`, action.data, action.token)

	if (Object.keys(res).length > 0) {
		yield put({type: "LEAVE_USER_SUCCEEDED", data: res});
	} else {
		yield put({type: "LEAVE_USER_FAILED"});
	}
}

export function* fetchAffiliate(action) {
	const res = yield call(getAPI, `/api/users/${action.id}/affiliate`);

	if (Object.keys(res).length > 0) {
		yield put({type: "LOAD_USER_AFFILIATE_SUCCEEDED", data: res});
	} else {
		yield put({type: "LOAD_USER_AFFILIATE_FAILED"});
	}
}

export function* updateAffiliate(action) {
	const res = yield call(patchAPI, `/api/users/${action.id}/affiliate`, action.data, action.token)

	if (Object.keys(res).length > 0) {
		yield put({type: "UPDATE_USER_AFFILIATE_SUCCEEDED", data: res});
	} else {
		yield put({type: "UPDATE_USER_AFFILIATE_FAILED"});
	}
}


export function* loadRecommendData(action) {
	try{
		let recommendBranches, reviews, recommends;
		yield Promise.all([
			(async () => {
				recommendBranches = await getAPI(`/api/users/${action.id}/recommend-branches`);
			})(),
			(async () => {
				reviews = await getAPI(`/api/users/${action.id}/reviews`);
			})(),
			(async () => {
				recommends = await getAPI(`/api/users/${action.id}/recommends`);
			})(),
		]);

		if (Object.keys(recommendBranches).length > 0) {
			yield put({type: "LOAD_USER_RECOMMEND_DATA_SUCCEEDED", recommendBranches, recommends, reviews});
			if (Object.keys(recommendBranches).length < 100) {
				yield put({type: "OPEN_ALL_RECOMMEND_BRANCHES"});
			} else {
				yield put({type: "CLOSE_ALL_RECOMMEND_BRANCHES"});
			}
		} else {
			if (typeof token === "string" && token.length > 0) {
				yield put({type: "ADD_RECOMMEND_BRANCH_REQUEST",
					token: action.token,
					patch: {prevId:"0", nextId:"0"},
					data: {
						name: "新しいリスト",
						userId: action.id,
						parentId: "0",
						prevId: "0",
						nextId: "0",
				}});
			}
		}
	} catch (e) {
		yield put({type: "LOAD_USER_RECOMMEND_DATA_FAILED", recommendBranches: {}, recommends: {}, reviews: {}});
	}
}

