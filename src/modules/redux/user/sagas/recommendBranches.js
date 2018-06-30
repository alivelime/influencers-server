import { call, put } from 'redux-saga/effects'
import { patchAPI } from 'modules/utils/Request';

function* addRecommendBranch(action) {
	try{
		const res = yield call(postAPI, `/api/recommend=branches`, action.data);
		if (Object.keys(res).length > 0) {
			yield put({type: "ADD_RECOMMEND_BRANCH_SUCCEEDED", res});
		} else {
			yield put({type: "ADD_RECOMMEND_BRANCH_FAILED", res});
		}
	} catch (e) {
		yield put({type: "ADD_RECOMMEND_BRANCH_FAILED", data: {id: action.data.id, name: e.message}});
	}
}

function* updateRecommendBranches(action) {
}

function* updateRecommendBranch(action) {
	try{
		const res = yield call(getAPI, `/api/users/${action.id}`, null);
		if (Object.keys(res).length > 0) {
			yield put({type: "UPDATE_RECOMMEND_BRANCH_SUCCEEDED", res});
		} else {
			yield put({type: "UPDATE_RECOMMEND_BRANCH_FAILED", res});
		}
	} catch (e) {
		yield put({type: "UPDATE_RECOMMEND_BRANCH_FAILED", error: e.message});
	}
}


