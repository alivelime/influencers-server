import { call, put } from 'redux-saga/effects'
import { postAPI } from 'modules/utils/Request';

export function* add(action) {
	try{
		let addFlag = action.isRecommend ? false : true;
		action.review.recommendBranchId = (addFlag 
			? ((yield put({type: "ADD_RECOMMEND_BRANCH_REQUEST", data: {
					name: action.review.recommendId,
					userId: action.review.urserId,
					parentId: action.recommendBranchId,
					prevId: "0",
					nextId: "0",
			 }})).id)
		 : action.recommendBranchId);

		const res = yield call(postAPI, `/api/reviews`, action.review);
		if (Object.keys(res).length === 0) {
			if (addFlag) {
				yield put({type: "DELETE_RECOMMEND_BRANCHES_REQUEST", ids: [action.review.recommendBranchId]});
			}
			return;
		}

		yield put({type: "ADD_REVIEW_SUCCEEDED", data: res});
	} catch (e) {
		yield put({type: "ADD_REVIEW_FAILED", error: e.message});
	}
}


