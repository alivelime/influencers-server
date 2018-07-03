import { connect } from 'react-redux'

import * from 'modules/redux/user/actions'
import RecommendBranch from 'modules/components/RecommendBranch';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = state => ({
	recommendBranches: state.recommendBranches,
	reviews: state.reviews,
	recommends: state.recommends,
	checker: state.checker,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	const reviews = getReviewList(state, props.id);
	const isChecked = (props.recommend) ?
		? state.checker.recommendIds.find(props.id)
		: state.checker.recommendBranchIds.find(props.id);

	return {
	...props,
	name: (props.id === "0" ? '' : state.recommendBranches[props.id]),

	children: getChildren(state, props.id),
	reviews: reviews,
	recommend: reviews.length > 0 ? state.recommends[reviews[0].recommendId] : null;

	handleCollaps: () => {state.recommendBranches[props.id].isOpen
		? dispatch(actions.closeRecommendBranch(props.id))
		: dispatch(actions.openRecommendBranch(props.id))
	},
	handleCheck: props.parentIsChecked 
		? () => {}
		: () => {
			(reviews.length > 0)
				? isChecked ? dispatch(actions.uncheckRecommend(props.id)) : dispatch(actions.checkRecommend(props.id)
				: isChecked ? dispatch(actions.uncheckRecommendBranch(props.id)) : dispatch(actions.uncheckRecommendBranch(props.id))
			}
	},
	handleSubmit: name => {dispatch(actions.updateRecommendBranch({id: props.id, name: name}))},
	isOpen: state.recommendBranches[props.id].isOpen || props.open,
	isChecked: isChecked || props.parentIsChecked,
}
};

/*
 * this.state.recommendBranches, recommends, reviews is one level list.
 * do not make complex as nested object.
 */
function getChildren(state, parentId) {
	// deep copy state.recommendBranches
	let recommendBranches = {};
	Object.keys(state.recommendBranches).forEach((id) => {
		recommendBranches[id] = Object.assign({}, state.recommendBranches[id]);
	});
	let children = [];

	// find parent id.
	const list = Object.keys(recommendBranches).filter((id) => {
		return recommendBranches[id].parentId === parentId;
	});
	if (list.length > 0) {
		let patchIds = [];

		const firsts = list.filter((id) => {
			return recommendBranches[id].prevId === "0";
		});

		let first;
		if (firsts.length >= 1) {
			first = firsts[0];
		} else {
			// if prevId is "0" not found.
			console.log("could not find first elem.");
			first = list[0];

			// fix prevId = "0"
			let recommendBranch = recommendBranches[first];
			recommendBranch.prevId = "0";
			patchIds.push(first);
		}

		let outOfLinks = {};
		list.forEach(id => outOfLinks[id] = null);

		let id, prevId;
		for (id = first;
				list.indexOf(id) >= 0;
				id = recommendBranches[id].nextId)
		{
			// check out of link.
			prevId = id;
			delete outOfLinks[id];
			children.push(id);
			
			// check if nextId is loop
			const nextId = recommendBranches[id].nextId;
			if (list.indexOf(nextId) >= 0 &&
					!outOfLinks.hasOwnProperty(nextId)
			) {
				console.log("recommend branches is loop!");
				// fix netxtId to zero.
				recommendBranch[id].nextId = "0";
				patchIds.push(id);
				break; // last recommendBranches is outOfLinks
			}
		}

		// if link is broken. concat last recommendBranches.
		if (Object.keys(outOfLinks).length > 0) {
			patchIds.push(prevId);
			Object.keys(outOfLinks).forEach((id) => {
				console.log(`link list is broken. so fix it. ${parentId}`);

				recommendBranches[prevId].nextId = id;

				recommendBranches[id].prevId = prevId;
				recommendBranches[id].nextId = "0";
				children.push(id);
				patchIds.push(id);

				prevId = id;
			});
		}

		// dispatch(actions.updateRecommendBranches(patchIds.map(id => recommendBranches[id])));
	} else {
		// if recommend branch is empty.
		// but do not addRecommendBranch.
		// Because recommendBranches is empty when ComponentDidMount() called.
	}

	return children.map(id => recommendBranches[id]);
}

function getReviewList(state, recommendBranchId) {
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


