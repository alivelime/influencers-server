import { connect } from 'react-redux'

import { loadUserRecommendData } from 'modules/redux/user/actions'
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	const reviews = getReviewList(props.id);

	return {
	...props,
	...state.recommendBranches[props.id],

	children: getChildren(state, props.id),
	reviews: reviews,
	recommend: reviews.length > 0 ? state.recommends[reviews[0].recommendId] : null;

	handleCollaps: () => {state.recommendBranches[props.id].isOpen
		? dispatch(closeRecommendBranch(props.id))
		: dispatch(openRecommendBranch(props.id))
	},
	handleCheck: props.parentIsChecked 
		? () => {}
		: () => {
			const checked = !state.recommendBranches[props.id].isChecked;
			(props.recommend)
				? dispatch(checkRecommend(props.id, checked))
				: dispatch(checkRecommendBranch(props.id, checked))
			)}
	},
	handleSubmit: name => {dispatch(updateRecommendBranch(Object.assign(state.recommendBranches[props.id], {name: name})))},
	isOpen: state.recommendBranches[props.id].isOpen || props.open,
	isChecked: state.recommendBranches[props.id].isChecked || props.parentIsChecked,
}
};

/*
 * this.state.recommendBranches, recommends, reviews is one level list.
 * do not make complex as nested object.
 */
function getChildren(state, parentId) {
	let recommendBranches = [];

	// find parent id.
	const list = Object.keys(state.recommendBranches).filter((id) => {
		return state.recommendBranches[id].parentId === parentId;
	});
	if (list.length > 0) {
		let patchRecommendBranches = [];

		const firsts = list.filter((id) => {
			return state.recommendBranches[id].prevId === "0";
		});

		// if prevId is "0" not found.
		let first;
		if (firsts.length >= 1) {
			first = firsts[0];
		} else {
			console.log("could not find first elem.");
			first = list[0];

			// fix prevId = "0"
			let recommendBranch = state.recommendBranches[first];
			recommendBranch.prevId = "0";
			patchRecommendBranches.push(recommendBranch);
		}

		let outOfLinks = {};
		list.forEach(id => outOfLinks[id] = null);

		let id, prevId;
		for (id = first;
				list.indexOf(id) >= 0;
				id = state.recommendBranches[id].nextId)
		{
			// check out of link.
			prevId = id;
			delete outOfLinks[id];

			recommendBranches.push(state.recommendBranches[id]);
			
			// check if nextId is loop
			const nextId = state.recommendBranches[id].nextId;
			if (list.indexOf(nextId) >= 0 &&
					!outOfLinks.hasOwnProperty(nextId)
			) {
				console.log("recommend branches is loop!");
				// fix netxtId to zero.
				let recommendBranch = state.recommendBranches[id];
				recommendBranch.nextId = "0";
				patchRecommendBranches.push(recommendBranch);
				break; // last recommendBranches is outOfLinks
			}
		}

		// if link is broken. concat last recommendBranches.
		if (Object.keys(outOfLinks).length > 0) {
			patchRecommendBranches.push(state.recommendBranches[prevId]);

			Object.keys(outOfLinks).forEach((id) => {
				console.log(`link list is broken. so fix it. ${parentId}`);

				let prev = state.recommendBranches[prevId];
				prev.nextId = id;

				let recommendBranch = state.recommendBranches[id];
				recommendBranch.prevId = prevId;
				recommendBranch.nextId = "0";
				recommendBranches.push(recommendBranch);

				patchRecommendBranches.push(recommendBranch);
				prevId = id;
			});
		}

		dispatch(updateRecommendBranches(patchRecommendBranches);
	} else {
		// if recommend branch is empty.
		// but do not addRecommendBranch.
		// Because recommendBranches is empty when ComponentDidMount() called.
	}

	return recommendBranches;
}

function getReviewList(recommendBranchId) {
	return Object.keys(state.reviews).filter((id) => {
		return state.reviews[id].recommendBranchId === recommendBranchId;
	})
	.map(id => state.reviews[id])
	.sort((a, b) => {return b.createdAt - a.createdAt});
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendBranch);


