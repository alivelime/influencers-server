
import { getAPI, postAPI, deleteAPI, patchAPI } from 'modules/utils/Request';


export default class UserRecommendTreeData {


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

