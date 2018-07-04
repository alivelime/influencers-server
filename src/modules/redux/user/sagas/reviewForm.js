import { call, put } from 'redux-saga/effects'
import { getAPI } from 'modules/utils/Request';

function* getPreview(action) {
	const res = yield call(getAPI, `/api/meta/${btoa(unescape(encodeURIComponent(url)))}`);
	if (Object.keys(res).length > 0) {
		yield put({type: "ADD_RECOMMEND_SUCCEEDED", res});
	}
}


