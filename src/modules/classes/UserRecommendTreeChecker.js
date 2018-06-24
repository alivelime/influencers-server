
export default class UserRecommendTreeChecker {

	// selected ids. do not use Object, because of cannot keep checked order.
	recommendBranchIds = [];
	recommendIds = [];

	recommendHandlers = {};
	recommendBranchHandlers = {};
	uncheckers = {};

	addRecommendHandler(name, handler) {
		this.recommendHandlers[name] = handler;
	}
	removeRecommendHandlers(name) {
		delete this.recommendHandlers[name];
	}

	addRecommendBranchHandler(name, handler) {
		this.recommendBranchHandlers[name] = handler;
	}
	removeRecommendBranchHandlers(name) {
		delete this.recommendBranchHandlers[name];
	}

	checkRecommend(id, url, value, unchecker) {
		if (value === true) {
			this.recommendIds.push(id);
			this.uncheckers[id] = unchecker;
		} else {
			this.recommendIds = this.recommendIds.filter((v) => {return v !== id});
			delete this.uncheckers[id];
		}

		for (const k in this.recommendHandlers) {
			this.recommendHandlers[k](id, url, value);
		}
	}
	checkRecommendBranch(id, value, unchecker) {
		if (value === true) {
			this.recommendBranchIds.push(id);
			this.uncheckers[id] = unchecker;
		} else {
			this.recommendBranchIds = this.recommendBranchIds.filter((v) => {return v !== id});
			delete this.uncheckers[id];
		}

		for (const k in this.recommendBranchHandlers) {
			this.recommendBranchHandlers[k](id, value);
		}
	}

	getRecommendBranchIds() {
		return Object.assign([], this.recommendBranchIds);
	}
	getRecommendIds() {
		return Object.assign([], this.recommendIds);
	}

	uncheckAll() {
		for (const k in this.uncheckers) {
			this.uncheckers[k]();
		}
		this.recommendBranchIds.forEach((id) => {
			this.checkRecommendBranch(id, false);
		});
		this.recommendIds.forEach((id) => {
			this.checkRecommend(id, '', false);
		});
	}

}

