import { takeEvery } from 'redux-saga/effects'

import * as session from 'modules/redux/user/sagas/session.js';
import * as user from 'modules/redux/user/sagas/user.js';
import * as recommendBranches from 'modules/redux/user/sagas/recommendBranches.js';
import * as reviews from 'modules/redux/user/sagas/reviews.js';
import * as recommends from 'modules/redux/user/sagas/recommends.js';
import * as reviewForm from 'modules/redux/user/sagas/reviewForm.js';
import * as timeline from 'modules/redux/user/sagas/timeline.js';

export default function* userSaga() {
	yield takeEvery("FETCH_LOGIN_USER_REQUEST", session.fetch);
	yield takeEvery("REGISTER_USER_REQUEST", session.registerUser);

	yield takeEvery("LOAD_USER_REQUEST", user.fetch);
	yield takeEvery("UPDATE_USER_REQUEST", user.update);
	yield takeEvery("DELETE_USER_REQUEST", user.leave);

	yield takeEvery("LOAD_USER_AFFILIATE_REQUEST", user.fetchAffiliate);
	yield takeEvery("UPDATE_USER_AFFILIATE_REQUEST", user.updateAffiliate);

	yield takeEvery("LOAD_USER_FOLLOWS_REQUEST", user.loadFollowIds);
	yield takeEvery("LOAD_USER_FOLLOWERS_REQUEST", user.loadFollowerIds);
	yield takeEvery("FOLLOW_USER_REQUEST", user.follow);
	yield takeEvery("UNFOLLOW_USER_REQUEST", user.unfollow);

	yield takeEvery("LOAD_USER_RECOMMEND_DATA_REQUEST", user.loadRecommendData);


	yield takeEvery("ADD_RECOMMEND_BRANCH_REQUEST", recommendBranches.add);
  yield takeEvery("ADD_SUB_RECOMMEND_BRANCH_REQUEST", recommendBranches.addSub); // use ADD_RECOMMEND_BRANCH_REQUEST instead
	yield takeEvery("UPDATE_RECOMMEND_BRANCH_REQUEST", recommendBranches.updateOne); // use ADD_RECOMMEND_BRANCHES_REQUEST instead.
	yield takeEvery("UPDATE_RECOMMEND_BRANCHES_REQUEST", recommendBranches.updateMulti);
	yield takeEvery("DELETE_RECOMMEND_BRANCH_REQUEST", recommendBranches.deleteOne); // use DELETE_RECOMMEND_BRANCHES_REQUEST instead
	yield takeEvery("DELETE_RECOMMEND_BRANCHES_REQUEST", recommendBranches.deleteMulti);

	yield takeEvery("MOVE_UP_RECOMMEND_BRANCH_REQUEST", recommendBranches.moveUp); // use UPDATE_RECOMMEND_BRANCH
	yield takeEvery("MOVE_DOWN_RECOMMEND_BRANCH_REQUEST", recommendBranches.moveDown); // use UPDATE_RECOMMEND_BRANCH
	yield takeEvery("MOVE_RECOMMEND_BRANCHES_REQUEST", recommendBranches.move); // use UPDATE_RECOMMEND_BRANCHES

	yield takeEvery("ADD_REVIEW_REQUEST", reviews.add);
	yield takeEvery("ADD_RECOMMEND_REQUEST", recommends.add);
	yield takeEvery("GET_PREVIEW_REQUEST", reviewForm.getPreview);
	yield takeEvery("FETCH_IINE_REVIEW_REQUEST", reviewForm.fetchIineReview);

	yield takeEvery("LOAD_TIMELINE_REQUEST", timeline.load);
}

