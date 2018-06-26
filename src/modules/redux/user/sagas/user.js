import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { getAPI, putAPI } from 'modules/utils/Request';

function fetchUser(action) {
	try{
		const data = yield call(getAPI, `/api/users/${action.id}`, null)
		yield put({type: "LOAD_USER_SUCCEEDED", data: data});
	} catch (e) {
		yield put({type: "LOAD_USER_FAILED", data: {id: action.id, name: e.message}});
	}
	getAPI(`/api/users/${id}`, null)
	.then((res) => {
		this.setState({name: res.name});
	});
}

function putUser(action) {
	try{
		const res = yield call(putAPI, `/api/users/${action.data.id}`, action.data)
		yield put({type: "PUT_USER_SUCCEEDED", data: res});
	} catch (e) {
		yield put({type: "PUT_USER_FAILED", data: {id: action.data.id, name: e.message}});
	}
}

function userSaga() {
	yield takeEvery("LOAD_USER_REQUESTED", fetchUser);
	yield takeEvery("SET_USER_REQUESTED", putUser);
}

