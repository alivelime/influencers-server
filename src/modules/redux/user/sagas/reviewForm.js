import { call, put } from 'redux-saga/effects'
import { getAPI, base64encode } from 'modules/utils/Request';

export function* getPreview(action) {
	const res = yield call(getAPI, `/api/meta/${base64encode(action.url)}`);
	if (Object.keys(res).length > 0) {
		yield put({type: "ADD_RECOMMEND_SUCCEEDED", res});
	}
}


