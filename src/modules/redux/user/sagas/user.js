import { call, put } from 'redux-saga/effects'
import { getAPI, putAPI } from 'modules/utils/Request';

export function* fetch(action) {
	try{
		const data = yield call(getAPI, `/api/users/${action.id}`, null);
		yield put({type: "LOAD_USER_SUCCEEDED", data: data});
	} catch (e) {
		yield put({type: "LOAD_USER_FAILED", data: {id: action.id, name: e.message}});
	}
}

export function* update(action) {
	try{
		const res = yield call(putAPI, `/api/users/${action.data.id}`, action.data)
		yield put({type: "UPDATE_USER_SUCCEEDED", data: res});
	} catch (e) {
		yield put({type: "UPDATE_USER_FAILED", data: {id: action.data.id, name: e.message}});
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
			yield put({type: "ADD_RECOMMEND_BRANCH_REQUEST", data: {
				name: "新しいリスト",
				userId: action.id,
				parentId: "0",
				prevId: "0",
				nextId: "0",
			}});
		}
	} catch (e) {
		yield put({type: "LOAD_USER_RECOMMEND_DATA_FAILED", recommendBranches: {}, recommends: {}, reviews: {}});
	}
}

