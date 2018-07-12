import { call, put } from 'redux-saga/effects'
import { getAPI, putAPI } from 'modules/utils/Request';

export function* fetch(action) {
	try{
		const data = yield call(getAPI, `/api/${action.sns}/verify/${action.token}`, null);
		yield put({type: "FETCH_SESSION_USER_SUCCEEDED", data: data});
	} catch (e) {
		yield put({type: "FETCH_SESSION_USER_FAILED"});
	}
}

export function* registerUser(action) {
	try{
		const res = yield call(postAPI, `/api/users/${action.data.id}`, action.data, action.token)
		yield put({type: "REGISTER_USER_SUCCEEDED", data: res});
	} catch (e) {
		yield put({type: "REGISTER_USER_FAILED"});
	}
}



