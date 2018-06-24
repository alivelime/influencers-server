
import { getAPI, postAPI, deleteAPI, patchAPI } from 'modules/utils/Request';


export default class UserRecommendTreeData {

	userId = 0;
	updateState;
	recommendBranches = [];
	reviews = {};
	recommends = {};

	constructor(updater) {
		this.updateState = updater;
	}

	async loadDataFromServer(userId) {
		this.userId = userId;
		await Promise.all([
			(async () => {
				this.recommendBranches = await getAPI(`/api/users/${this.userId}/recommend-branches`);
			})(),
			(async () => {
				this.reviews = await getAPI(`/api/users/${this.userId}/reviews`);
			})(),
			(async () => {
				this.recommends = await getAPI(`/api/users/${this.userId}/recommends`);
			})(),
		]);

		if (Object.keys(this.recommendBranches).length > 0) {
			Object.keys(this.reviews).forEach((id) => {
				this.reviews[id]["meta"] = this.recommends[this.reviews[id].evidence];
			});
		} else {
			this.addRecommendBranch("0");
		}

		this.updateState({
				recommendBranches: this.recommendBranches,
				reviews: this.reviews,
				recommends: this.recommends
		});
	}

	moveUpRecommendBranch = (id) => {
		const prevId = this.recommendBranches[id].prevId;
		if (prevId !== "0") {
			this.moveDownRecommendBranch(prevId);
			return;
		}
	}
	moveDownRecommendBranch = (id) => {
		let recommendBranches = Object.assign({}, this.recommendBranches);

		const B = id;
		const A = this.recommendBranches[B].prevId;
		const C = this.recommendBranches[B].nextId;

		// id is bottom.
		if (C === "0") {
			return;
		}
		const D = this.recommendBranches[C].nextId;

		// set prev id
		if (A !== "0") {
			recommendBranches[A].nextId = C;
			patchAPI(`/api/recommend-branches/${A}`, {
				nextId: C,
			});
		}

		recommendBranches[B].prevId = C;
		recommendBranches[B].nextId = D;
		patchAPI(`/api/recommend-branches/${B}`, {
			prevId: C,
			nextId: D,
		});

		recommendBranches[C].prevId = A;
		recommendBranches[C].nextId = B;
		patchAPI(`/api/recommend-branches/${C}`, {
			prevId: A,
			nextId: B,
		});

		if (D !== "0") {
			recommendBranches[D].prevId = B;
			patchAPI(`/api/recommend-branches/${D}`, {
				prevId: B,
			});
		}

		this.recommendBranches = recommendBranches;
		this.updateState({recommendBranches: this.recommendBranches});
	};
	moveRecommendBranches = (recommendBranchIds, recommendIds) => {
		// move to last recommendBranches
		const to = recommendBranchIds.pop();

		let patchIds = {};
		let last = Object.keys(this.recommendBranches).find((id) => {
			return this.recommendBranches[id].parentId === to && this.recommendBranches[id].nextId === "0";
		});

		recommendBranchIds.concat(recommendIds).forEach((id) => {
			if (last === id) { console.log("skip " + id + " is last."); return;}

			if (last in this.recommendBranches) {
				this.recommendBranches[last].nextId = id;
				patchIds[last] = true;
			}
			
			// remove from old branch.
			const prevId = this.recommendBranches[id].prevId;
			if (prevId in this.recommendBranches) {
				this.recommendBranches[prevId].nextId = this.recommendBranches[id].nextId;
				patchIds[prevId] = true;
			}
			const nextId = this.recommendBranches[id].nextId;
			if (nextId in this.recommendBranches) {
				this.recommendBranches[nextId].prevId = this.recommendBranches[id].prevId;
				patchIds[nextId] = true;
			}

			// set new data.
			this.recommendBranches[id].parentId = to;
			this.recommendBranches[id].prevId = (last ? last : "0");
			this.recommendBranches[id].nextId = "0"; // set next loop.

			patchIds[id] = true;
			last = id;
		});

		Object.keys(patchIds).forEach((id) => {
			console.log("move " + id + 
					" to " + this.recommendBranches[id].parentId +
					" prev " +  this.recommendBranches[id].prevId +
					" next " +  this.recommendBranches[id].nextId );
			patchAPI(`/api/recommend-branches/${id}`,{
				parentId: this.recommendBranches[id].parentId,
				nextId: this.recommendBranches[id].nextId,
				prevId: this.recommendBranches[id].prevId,
			});
		});

		this.updateState({recommendBranches: this.recommendBranches});
	}

	addRecommendBranch = async (id) => {
		// if id = 0 then add first branch.
		let res = await postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.userId,
			prevId: id,
			nextId: (id === "0" ? "0" : this.recommendBranches[id].nextId),
		})

		this.recommendBranches[res.id] = res;

		// set nextId of prev branch.
		if (id !== "0") {
			this.recommendBranches[id].nextId = res.id;
		}
		// set prevId of next branch.
		if (res.nextId !== "0") {
			this.recommendBranches[res.nextId].prevId = res.id;
		}

		this.updateState({recommendBranches: this.recommendBranches});
	};

	addSubRecommendBranch = async (parentId) => {
		// insert sub last branch.
		const last = Object.keys(this.recommendBranches).find((id) => {
			return (this.recommendBranches[id].parentId === parentId && this.recommendBranches[id].nextId === "0");
		});

		const res = await postAPI(`/api/recommend-branches`, {
			name: "新しいリスト",
			userId: this.userId,
			parentId: parentId,
			prevId: last || "0",
			nextId: "0",
		})

		this.recommendBranches[res.id] = res;
		if (last) {
			this.recommendBranches[last].nextId = res.id;
		}

		this.updateState({recommendBranches: this.recommendBranches});
		return res;
	};

	addReview = (review, recommend) => {
		recommend.title = recommend.url;
		this.reviews[review.id] = review;
		this.recommends[recommend.url] = recommend;
		this.updateState({
			reviews: this.reviews,
			recommends: this.recommends,
		});
	};

	deleteRecommendBranch = (ids) => {

		(async () => {
		  // do not use forEach for calling api in order.
			for (let id of ids) {
				await deleteAPI(`/api/recommend-branches/${id}`);
			}
	 })();

		ids.forEach((id) => {
			const prev = this.recommendBranches[this.recommendBranches[id].prevId];
			if (prev) {
				prev.nextId = this.recommendBranches[id].nextId;
			}
			const next = this.recommendBranches[this.recommendBranches[id].nextId];
			if (next) {
				next.prevId = this.recommendBranches[id].prevId;
			}
			delete this.recommendBranches[id];
		});

		// if recommendBranches is empty then add new branch.
		if (Object.keys(this.recommendBranches).length === 0) {	
				return this.addRecommendBranch("0");
		}

		this.updateState({recommendBranches: this.recommendBranches});
	};

	updateRecommend = (recommend) => {
		this.recommends[recommend.url] = recommend;
		this.updateState({recommends: this.recommends});
	};
	updateEvidence = (review, evidence) => {
		review["meta"] = evidence;
		this.reviews[review.id] = review;
		this.updateState({reviews: this.reviews});
	};

	searchRecommendBranchIds = (url) => {
		return Object.keys(this.reviews).filter((id) => {
			return this.reviews[id].recommendId === url;
		})
		.map((id) => {
			return this.reviews[id].recommendBranchId;
		});
	};
	getRecommendBranch = (id) => {
		return Object.assing({}, this.recommendBranches[id]);
	};
	recommendBranchIsRecommend = (id, url) => {
		if (id === "0") return false;

		const reviewIds = Object.keys(this.reviews).filter((reviewId) => {
			return this.reviews[reviewId].recommendBranchId === id;
		});

		if (reviewIds.length === 0) return false;

		if (url) {
			return this.reviews[reviewIds[0]].recommendId === url;
		} else {
			return true;
		}
	}
	changeRecommendBranch = (id, name) => {
		patchAPI(`/api/recommend-branches/${id}`, {name: name});
		this.recommendBranches[id].name = name;
	}

	// get 1 level list. and fix broken list.
	getRecommendBranchesList = (parentId) => {
		let recommendBranches = [];

		// find parent id.
		const list = Object.keys(this.recommendBranches).filter((id) => {
			return this.recommendBranches[id].parentId === parentId;
		});
		if (list.length > 0) {
			let patchIds = [];

			const firsts = list.filter((id) => {
				return this.recommendBranches[id].prevId === "0";
			});

			// if prevId is "0" not found.
			let first;
			if (firsts.length >= 1) {
				first = firsts[0];
			} else {
				console.log("could not find first elem.");
				first = list[0];

				// fix prevId = "0"
				let recommendBranch = this.recommendBranches[first];
				recommendBranch.prevId = "0";
				patchIds.push(first);
			}

			let outOfLinks = {};
			list.forEach(id => outOfLinks[id] = null);

			let id, prevId;
			for (id = first;
					list.indexOf(id) >= 0;
					id = this.recommendBranches[id].nextId)
			{
				// check out of link.
				prevId = id;
				delete outOfLinks[id];

				recommendBranches.push(this.recommendBranches[id]);
				
				// check if nextId is loop
				const nextId = this.recommendBranches[id].nextId;
				if (list.indexOf(nextId) >= 0 &&
						!outOfLinks.hasOwnProperty(nextId)
				) {
					console.log("recommend branches is loop!");
					// fix netxtId to zero.
					let recommendBranch = this.recommendBranches[id];
					recommendBranch.nextId = "0";
					patchIds.push(id);
					break; // last recommendBranches is outOfLinks
				}
			}

			// if link is broken. concat last recommendBranches.
			if (Object.keys(outOfLinks).length > 0) {
				patchIds.push(prevId);

				Object.keys(outOfLinks).forEach((id) => {
					console.log(`link list is broken. so fix it. ${parentId}`);

					let prev = this.recommendBranches[prevId];
					prev.nextId = id;

					let recommendBranch = this.recommendBranches[id];
					recommendBranch.prevId = prevId;
					recommendBranch.nextId = "0";
					recommendBranches.push(recommendBranch);

					patchIds.push(id);
					prevId = id;
				});
			}

			patchIds.forEach((id) => {
				patchAPI(`/api/recommend-branches/${id}`, {
					prevId: this.recommendBranches[id].prevId,
					nextId: this.recommendBranches[id].nextId,
				});
			});

		} else {
			// if recommend branch is empty.
			// but do not addRecommendBranch.
			// Because recommendBranches is empty when ComponentDidMount() called.
		}

		return recommendBranches;
	};

	getReviewList(recommendBranchId) {
		return Object.keys(this.reviews).filter((id) => {
			return this.reviews[id].recommendBranchId === recommendBranchId;
		})
		.map(id => this.reviews[id])
		.sort((a, b) => { return b.createdAt - a.createdAt});
	}

}

