
export default class UserRecommendTreeChecker {

	recommendBranches = {};
	recommends = {};

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
			this.recommends[id] = url;
			this.uncheckers[id] = unchecker;
		} else {
			delete this.recommends[id];
			delete this.uncheckers[id];
		}

		for (const k in this.recommendHandlers) {
			this.recommendHandlers[k](id, url, value);
		}
	}
	checkRecommendBranch(id, value, unchecker) {
		if (value === true) {
			this.recommendBranches[id] = true;
			this.uncheckers[id] = unchecker;
		} else {
			delete this.recommendBranches[id];
			delete this.uncheckers[id];
		}

		for (const k in this.recommendBranchHandlers) {
			this.recommendBranchHandlers[k](id, value);
		}
	}

	getRecommendBranchIds() {
		return Object.keys(this.recommendBranches);
	}
	getRecommendIds() {
		return Object.keys(this.recommends);
	}

	uncheckAll() {
		for (const k in this.uncheckers) {
			this.uncheckers[k]();
		}
	}

}

