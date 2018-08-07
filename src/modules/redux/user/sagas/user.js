import { call, put } from 'redux-saga/effects'
import { getAPI, postAPI, patchAPI, deleteAPI } from 'modules/utils/Request';

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

		// update recommends
		let recommends = yield call(getAPI, `/api/users/${action.id}/recommends`);
		if (Object.keys(recommends).length > 0) {
			yield put({type: "LOAD_USER_RECOMMEND_DATA_SUCCEEDED", recommends});
		}
	} else {
		yield put({type: "UPDATE_USER_AFFILIATE_FAILED"});
	}
}

export function* loadFollowIds(action) {
	const res = yield call(getAPI, `/api/users/${action.id}/follows`);

	if (Array.isArray(res)) {
		let users = {};
		{
			let userIds = res;
			yield Promise.all(
				userIds.map((id) => {
					return (async () => {
						const user = await getAPI(`/api/users/${id}`);
						if (Object.keys(user).length > 0) {
							users[id] = user;
						} else {
							users[id] = {};
						}
					})()
				})
			);
		}
		yield put({type: "LOAD_USER_FOLLOWS_SUCCEEDED", data: users});
	} else {
		yield put({type: "LOAD_USER_FOLLOWS_FAILED"});
	}
}

export function* loadFollowerIds(action) {
	const res = yield call(getAPI, `/api/users/${action.id}/followers`);

	if (Array.isArray(res)) {
		let users = {};
		{
			let userIds = res;
			yield Promise.all(
				userIds.map((id) => {
					return (async () => {
						const user = await getAPI(`/api/users/${id}`);
						if (Object.keys(user).length > 0) {
							users[id] = user;
						} else {
							users[id] = {};
						}
					})()
				})
			);
		}
		yield put({type: "LOAD_USER_FOLLOWERS_SUCCEEDED", data: users});
	} else {
		yield put({type: "LOAD_USER_FOLLOWERS_FAILED"});
	}
}

export function* follow(action) {
	yield call(postAPI, `/api/users/${action.i}/follows/${action.u}`, null, action.token)
	yield put({type: "FOLLOW_USER_SUCCEEDED", data: {id: action.i, ...action.user}});
}

export function* unfollow(action) {
	yield call(deleteAPI, `/api/users/${action.i}/follows/${action.u}`, action.token)
	yield put({type: "UNFOLLOW_USER_SUCCEEDED", id: action.i});
}

export function* loadRecommendData(action) {
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
		if (typeof action.token === "string" && action.token.length > 0) {
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
		} else {
			yield put({type: "LOAD_USER_RECOMMEND_DATA_FAILED"});
		}
	}
}

