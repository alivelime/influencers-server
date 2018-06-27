import { call, put, takeEvery } from 'redux-saga/effects'
import { getAPI, putAPI } from 'modules/utils/Request';

function* fetchUser(action) {
	try{
		const data = yield call(getAPI, `/api/users/${action.id}`, null);
		yield put({type: "LOAD_USER_SUCCEEDED", data: data});
	} catch (e) {
		yield put({type: "LOAD_USER_FAILED", data: {id: action.id, name: e.message}});
	}
}

function* updateUser(action) {
	try{
		const res = yield call(putAPI, `/api/users/${action.data.id}`, action.data)
		yield put({type: "UPDATE_USER_SUCCEEDED", data: res});
	} catch (e) {
		yield put({type: "UPDATE_USER_FAILED", data: {id: action.data.id, name: e.message}});
	}
}

export default function* userSaga() {
	yield takeEvery("LOAD_USER_REQUEST", fetchUser);
	yield takeEvery("UPDATE_USER_REQUEST", updateUser);
}

