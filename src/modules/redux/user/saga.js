import { call, put, takeEvery } from 'redux-saga/effects'
import { getAPI, putAPI } from 'modules/utils/Request';

function* fetchUser(action) {
	try{
		const data = yield call(getAPI, `/api/users/${action.id}`, null);
		yield put({type: "LOAD_USER_SUCCEEDED", data: data});
	} catch (e) {
		yield put({type: "LOAD_USER_FAILED", data: {id: action.id, name: e.message}});
	}
}

function* updateUser(action) {
	try{
		const res = yield call(putAPI, `/api/users/${action.data.id}`, action.data)
		yield put({type: "UPDATE_USER_SUCCEEDED", data: res});
	} catch (e) {
		yield put({type: "UPDATE_USER_FAILED", data: {id: action.data.id, name: e.message}});
	}
}

function* loadUserRecommendData(action) {
	try{
		let recommendBranches, reviews, recommends;
		yield call(Promise.all, ([
			(async () => {
				recommendBranches = await getAPI(`/api/users/${action.userId}/recommend-branches`);
			})(),
			(async () => {
				reviews = await getAPI(`/api/users/${action.userId}/reviews`);
			})(),
			(async () => {
				recommends = await getAPI(`/api/users/${action.userId}/recommends`);
			})(),
		]));

		if (Object.keys(recommendBranches).length > 0) {
			yield put({type: "LOAD_USER_RECOMMEND_DATA_SUCCEEDED", recommendBranches, recommends, reviews});
		} else {
			yield put({type: "ADD_RECOMMEND_BRANCH", {id: "0"});
		}
	} catch (e) {
		yield put({type: "LOAD_USER_RECOMMEND_DATA_FAILED", recommendBranches: {}, recommends: {}, reviews: {}});
	}
}

export default function* userSaga() {
	yield takeEvery("LOAD_USER_REQUEST", fetchUser);
	yield takeEvery("UPDATE_USER_REQUEST", updateUser);
	yield takeEvery("ADD_RECOMMEND_BRANCH_REQUEST", addRecommendBranch);
	yield takeEvery("ADD_SUB_RECOMMEND_BRANCH_REQUEST", addSubRecommendBranch);
	yield takeEvery("DELETE_RECOMMEND_BRANCH_REQUEST", deleteRecommendBranch);
	yield takeEvery("MOVE_UP_RECOMMEND_BRANCH_REQUEST", moveUpRecommendBranch);
	yield takeEvery("MOVE_DOWN_RECOMMEND_BRANCH_REQUEST", moveDownRecommendBranch);
	yield takeEvery("MOVE_RECOMMEND_BRANCHES_REQUEST", moveRecommendBranches);
	yield takeEvery("LOAD_USER_RECOMMEND_DATA_REQUEST", loadUserRecommendData);
}

