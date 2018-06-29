
import { getAPI, postAPI, deleteAPI, patchAPI } from 'modules/utils/Request';


export default class UserRecommendTreeData {

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
		return Object.assign({}, this.recommendBranches[id]);
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


}

