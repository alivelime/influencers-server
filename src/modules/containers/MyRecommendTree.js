import { connect } from 'react-redux'

import * from 'modules/redux/user/actions'
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/18/190841
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,
	dataLoaded: Object.keys(state.recommendBranches).length > 0,
	loadUserRecommendData: () => dispatch(actions.loadUserRecommendData(props.userId)),

	// RecommendToolbox
  addRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => {
				const id = state.checker.checkedRecommendBranchIds[0];
				dispatch(actions.addRecommendBranch(data: {
					name: "新しいリスト",
					userId: props.userId,
					parentId: state.recommendBranches[id].parentId,
					prevId: id,
					nextId: (id === "0" ? "0" : state.recommendBranches[id].nextId),
				}))}
			: null
	,
  addSubRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => {
				// insert sub last branch.
				const parentId = state.checker.checkedRecommendBranchIds[0];
				const last = Object.keys(state.recommendBranches).find((id) => {
					return (state.recommendBranches[id].parentId === parentId && state.recommendBranches[id].nextId === "0");
				});
				dispatch(actions.addRecommendBranch(data: {
					name: "新しいリスト",
					userId: props.userId,
					parentId: parentId,
					prevId: last || "0",
					nextId: "0",
				}))}
			: null
	,
  deleteRecommendBranches:
		state.checker.recommendBranchIds.length > 0
			? () => { dispatch(actions.deleteRecommendBranches(state.checker.recommendBranchIds)) }
			: null
	,
  moveUpRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => { moveUpRecommendBranch(state, (state.checker.recommendBranchIds[0] || state.checker.recommendId[0]), dispatch); }
		: null
	,
  moveDownRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => { moveDownRecommendBranch(state, (state.checker.recommendBranchIds[0] || state.checker.recommendId[0]), dispatch); }
		: null
	,
  moveRecommendBranches:
		(state.checker.recommendBranchIds.length >= 1 && 
		 (state.checker.recommendBranchIds.length + state.checker.recommendIds.length) >= 2
		) ? () => { moveRecommendBranches(state, state.checker.recommendBranchIds, state.checker.recommendBranchIds, dispatch) }
			: null
	,

});

function moveUpRecommendBranch(state, id, dispatch) {
	const prevId = state.recommendBranches[id].prevId;
	if (prevId !== "0") {
		moveDownRecommendBranch(state, prevId, dispatch);
	}
}
function moveDownRecommendBranch(state, id, dispatch) {
	let recommendBranches = Object.assign({}, state.recommendBranches);
	let patchRecommendBranches = [];

	const B = id;
	const A = state.recommendBranches[B].prevId;
	const C = state.recommendBranches[B].nextId;

	// id is bottom.
	if (C === "0") {
		return;
	}
	const D = state.recommendBranches[C].nextId;

	// set prev id
	if (A !== "0") {
		recommendBranches[A].nextId = C;
		patchRecommendBranches.push({
			id: A,
			nextId: C,
		});
	}

	recommendBranches[B].prevId = C;
	recommendBranches[B].nextId = D;
	patchRecommendBranches.push({
		id: B,
		prevId: C,
		nextId: D,
	});

	recommendBranches[C].prevId = A;
	recommendBranches[C].nextId = B;
	patchRecommendBranches({
		id: C,
		prevId: A,
		nextId: B,
	});

	if (D !== "0") {
		recommendBranches[D].prevId = B;
		patchRecommendBranches({
			id: D,
			prevId: B,
		});
	}
	dispatch(updateRecommendBranches(patchRecommendBranches);
}
function moveRecommendBranches(state, _recommendBranchids, _recommendIds, dispatch) {
	let recommendBrancheIds = Object.assign([], _recommendBranchIds);
	let recommendIds = Object.assign([], _recommendIds);
	let patchRecommendBranches = {};

	// move to last recommendBranches
	const to = recommendBranchIds.pop();

	let patchIds = {};
	let last = Object.keys(state.recommendBranches).find((id) => {
		return state.recommendBranches[id].parentId === to && state.recommendBranches[id].nextId === "0";
	});

	recommendBranchIds.concat(recommendIds).forEach((id) => {
		if (last === id) { console.log("skip " + id + " is last."); return;}

		if (last in state.recommendBranches) {
			if (!(last in patchRecommendBranches)) {
				patchRecommendBranches[last] = Object.assign({}, state.recommendBranches[last]);
			}
			patchRecommendBranches[last].nextId = id;
		}
		
		// remove from old branch.
		const prevId = state.recommendBranches[id].prevId;
		if (prevId in state.recommendBranches) {
			if (!(prevId in patchRecommendBranches)) {
				patchRecommendBranches[prevId] = Object.assign({}, state.recommendBranches[prevId]);
			}
			patchRecommendBranches[prevId].nextId = state.recommendBranches[id].nextId;
		}
		const nextId = state.recommendBranches[id].nextId;
		if (nextId in state.recommendBranches) {
			if (!(nextId in patchRecommendBranches)) {
				patchRecommendBranches[nextId] = Object.assign({}, state.recommendBranches[nextId]);
			}
			patchRecommendBranches[nextId].prevId = state.recommendBranches[id].prevId;
		}

		// set new data.
		patchRecommendBranches[id] = {
			parentId: to,
			prevId: (last ? last : "0"),
			nextId: "0",
		};

		last = id;
	});

	dispatch(updateRecommendBranches(Object.keys(patchRecommendBranches).map((id) => {
		return {
			id: id,
			parentId: patchRecommendBranches[id].parentId,
			nextId: patchRecommendBranches[id].nextId,
			prevId: patchRecommendBranches[id].prevId,
		}
	}));
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendTree);

