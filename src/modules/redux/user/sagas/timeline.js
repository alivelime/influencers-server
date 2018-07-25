import { call, put } from 'redux-saga/effects'
import { getAPI } from 'modules/utils/Request';

export function* load(action) {
	const res = yield call(getAPI, `/api/users/${action.id}/timeline`);

	if (Object.keys(res).length > 0) {

		// get user data.
		const users = {};
		const reviews = {};
		{
			let userIds = Array.from(new Set(
					Object.assign([],
						res.i.filter(v => {return v.u !== "0"}),
						res.me.map(v => v.i))
			));
			yield Promise.all(
				userIds.map((id) => {
					return (async () => {
						const user = await getAPI(`/api/users/${id}`);
						if (Object.keys(user).length > 0) {
							users[id] = user;
						} else {
							users[id] = {};
						}
					})()
				})
			);

			// timeline i, get "to you" user data.
			for (let i = 0; i < res.i.length; i++) {
				const u = res.i[i].u;
				if (u !== "0") {
					res.i[i].user = users[u];
				}
			}

			// timeline me, get "who do something to me" user data.
			for (let i = 0; i < res.i.length; i++) {
				const w = res.i[i].i;
				if (w !== "0") {
					res.i[i].user = users[w];
				}
			}
		}

		yield put({type: "LOAD_TIMELINE_SUCCEEDED", data: res, users, reviews});

	} else {
		yield put({type: "LOAD_TIMELINE_FAILED"});
	}
}

