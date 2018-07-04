
import { getAPI, postAPI, deleteAPI, patchAPI } from 'modules/utils/Request';


export default class UserRecommendTreeData {


	searchRecommendBranchIds = (url) => {
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

