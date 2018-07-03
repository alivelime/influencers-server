import { takeEvery } from 'redux-saga/effects'

import {*} from 'modules/redux/user/sagas/user.js';
import {*} from 'modules/redux/user/sagas/recommendBranches.js';

export default function* userSaga() {
	yield takeEvery("LOAD_USER_REQUEST", fetchUser);
	yield takeEvery("UPDATE_USER_REQUEST", updateUser);

	yield takeEvery("LOAD_USER_RECOMMEND_DATA_REQUEST", loadUserRecommendData);
	yield takeEvery("UPDATE_RECOMMEND_BRANCH_REQUEST", updateRecommendBranch);
	yield takeEvery("UPDATE_RECOMMEND_BRANCHES_REQUEST", updateRecommendBranches);

	yield takeEvery("ADD_RECOMMEND_BRANCH_REQUEST", addRecommendBranch);
// yield takeEvery("ADD_SUB_RECOMMEND_BRANCH_REQUEST", addSubRecommendBranch);
	yield takeEvery("DELETE_RECOMMEND_BRANCHES_REQUEST", deleteRecommendBranches);
//	yield takeEvery("MOVE_UP_RECOMMEND_BRANCH_REQUEST", moveUpRecommendBranch); // use UPDATE_RECOMMEND_BRANCH
//	yield takeEvery("MOVE_DOWN_RECOMMEND_BRANCH_REQUEST", moveDownRecommendBranch); // use UPDATE_RECOMMEND_BRANCH
//	yield takeEvery("MOVE_RECOMMEND_BRANCHES_REQUEST", moveRecommendBranches); // use UPDATE_RECOMMEND_BRANCHES

}

