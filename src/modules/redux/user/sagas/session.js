import { call, put } from 'redux-saga/effects'
import { getAPI, postAPI } from 'modules/utils/Request';

export function* fetch(action) {
		const res = yield call(getAPI, `/api/${action.sns}/verify`, action.token);
		if (Object.keys(res).length > 0) {
			yield put({type: "FETCH_LOGIN_USER_SUCCEEDED", data: res});
		} else {
			yield put({type: "FETCH_LOGIN_USER_FIALED"});
		}
}

export function* registerUser(action) {
		const res = yield call(postAPI, `/api/${action.sns}/register`, action.data, action.token)
		if (Object.keys(res).length > 0) {
			yield put({type: "REGISTER_USER_SUCCEEDED", data: res});
		} else {
			yield put({type: "REGISTER_USER_FAILED"});
		}
}



