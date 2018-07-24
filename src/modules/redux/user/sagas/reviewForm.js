import { call, put } from 'redux-saga/effects'
import { getAPI, base64encode } from 'modules/utils/Request';

export function* getPreview(action) {
	const res = yield call(getAPI, `/api/meta/${base64encode(action.url)}`);
	if (Object.keys(res).length > 0) {
		yield put({type: action.callback, data: res});
	}
}

export function* fetchIineReview(action) {
	const res = yield call(getAPI, `/api/reviews/${action.id}`);
	if (Object.keys(res).length > 0) {
		const recommend = yield call(getAPI, `/api/recommends/${base64encode(res.recommendId)}`);
		yield put({type: 'FETCH_IINE_REVIEW_SUCCEEDED', data: res, kind: recommend.kind && 'mono'});
	}
}

