import { call, put } from 'redux-saga/effects'
import { getAPI, base64encode } from 'modules/utils/Request';

import * as config from 'config';

export function* load(action) {
try {
	const res = yield call(getAPI, `/api/users/${action.id}/timeline`);

	if (Object.keys(res).length > 0) {

		// get user data.
		let users = {};
		let reviews = {};
		let recommends = {};
		{
			let userIds = Array.from(new Set([].concat(
				res.i.filter(v => {return v.u !== "0"}).map(v => v.u),
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

			let reviewIds = Array.from(new Set([].concat(
				res.i.filter(v => v.event === config.TIMELINE_IIYO || v.event === config.TIMELINE_IINE).map(v => v.what),
				res.me.filter(v => v.event === config.TIMELINE_IIYO || v.event === config.TIMELINE_IINE).map(v => v.what),
			)));
			yield Promise.all(
				reviewIds.map((id) => {
					return (async () => {
						const review = await getAPI(`/api/reviews/${id}`);
						if (Object.keys(review).length > 0) {
							reviews[id] = review;
						} else {
							review[id] = {};
						}
					})()
				})
			);

			let recommendIds = Array.from(new Set(Object.keys(reviews).map(id => reviews[id].recommendId)));
			yield Promise.all(
				recommendIds.map((id) => {
					return (async () => {
						const recommend = await getAPI(`/api/recommends/${base64encode(id)}`);
						if (Object.keys(recommend).length > 0) {
							recommends[id] = recommend;
						} else {
							recommend[id] = {};
						}
					})()
				})
			);
		}

		yield put({type: "LOAD_TIMELINE_SUCCEEDED", data: res, users, reviews, recommends});
	} else {
		yield put({type: "LOAD_TIMELINE_FAILED"});
	}

} catch (err) {
	console.error(err.message);
}
}

