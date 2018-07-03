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
function* addSubRecommendBranch(action) {
	throw Error("use addRecommendBranch.");
}
function* moveRecommendBranch(action) {
	throw Error("use action creator.");
}


function* updateRecommendBranch(action) {
	try{
		const res = yield call(patchAPI, `/api/recommend-branches/${action.data.id}`, data);
		if (Object.keys(res).length > 0) {
			yield put({type: "UPDATE_RECOMMEND_BRANCH_SUCCEEDED", res});
		} else {
			yield put({type: "UPDATE_RECOMMEND_BRANCH_FAILED", res});
		}
	} catch (e) {
		yield put({type: "UPDATE_RECOMMEND_BRANCH_FAILED", error: e.message});
	}
}

function* updateRecommendBranches(action) {
	try{
		let res = [];
		yield call(Promise.all, ([
			action.data.map((data) => {
				(async () => {
					res.push(await patchAPI(`/api/recommend-branches/${data.id}`, data));
				})()
			});
		]));

		yield put({type: "UPDATE_RECOMMEND_BRANCHES_SUCCEEDED", res: res});
	} catch (e) {
		yield put({type: "UPDATE_RECOMMEND_BRANCHES_FAILED", error: e.message});
	}
}
function* deleteRecommendBranches(action) {
	try{
		action.ids.forEach((id) => {
			// call one by one. do not call concurrency. data will be broken.
			yield call(deletehAPI, `/api/recommend-branches/${id}`);
		});
		yield put({type: "DELETE_RECOMMEND_BRANCH_SUCCEEDED", action.ids});
	} catch (e) {
		yield put({type: "UPDATE_RECOMMEND_BRANCH_FAILED", error: e.message});
	}
}


