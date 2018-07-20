import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendBranch from 'modules/components/RecommendBranch';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = state => ({
	checker: state.checker,
	token: state.session.token,

	recommendBranches: state.recommendBranches,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	const reviews = getReviewList(state, props.id);
	const isChecked = (reviews.length > 0) 
		? state.checker.recommendIds.includes(props.id)
		: state.checker.recommendBranchIds.includes(props.id);

	return {
		...props,

		isChecked: isChecked,
		reviewIds: props.getReviewIds(props.id),
		found: props.found || props.search(props.id),

		...props,

		name: (props.id === "0" ? '' : state.recommendBranches[props.id].name),

		children: getChildren(state, props.id, dispatch),
		reviews: reviews,
		recommend: reviews.length > 0 ? state.recommends[reviews[0].recommendId] : null,

		handleCollapse: () => {state.recommendBranches[props.id].isOpen
			? dispatch(actions.closeRecommendBranch(props.id))
			: dispatch(actions.openRecommendBranch(props.id))
		},
		handleCheck: props.parentIsChecked 
			? () => {}
			: () => {
				(reviews.length > 0)
					? (isChecked
						? dispatch(actions.uncheckRecommend(props.id)) 
						: dispatch(actions.checkRecommend( props.id, reviews[0].recommendId)))
					: (isChecked 
						? dispatch(actions.uncheckRecommendBranch(props.id)) 
						: dispatch(actions.checkRecommendBranch(props.id)))
				}
		,
		handleSubmit: name => {dispatch(actions.updateRecommendBranch({id: props.id, name: name}, state.token))},
		isOpen: props.id !== "0" && state.recommendBranches[props.id].isOpen,
		isChecked: isChecked,
	}
};

/*
 * this.state.recommendBranches, recommends, reviews is one level list.
 * do not make complex as nested object.
 */
function getChildren(_recommendBranches, parentId, dispatch) {
	// deep copy state.recommendBranches
	let recommendBranches = {};
	Object.keys(_recommendBranches).forEach((id) => {
		recommendBranches[id] = Object.assign({}, _recommendBranches[id]);
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
				recommendBranches[id].nextId = "0";
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

		if (patchIds.length > 0) {
			dispatch(actions.updateRecommendBranches(patchIds.map(id => recommendBranches[id]), state.token));
		}
	} else {
		// if recommend branch is empty.
		// but do not addRecommendBranch.
		// Because recommendBranches is empty when ComponentDidMount() called.
	}

	return children;
}

function getReviewList(_reviews, recommendBranchId) {
	return Object.keys(state.reviews).filter((id) => {
		return _reviews[id].recommendBranchId === recommendBranchId;
	})
	.map(id => _reviews[id])
	.sort((a, b) => {return b.createdAt - a.createdAt});
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendBranch);



