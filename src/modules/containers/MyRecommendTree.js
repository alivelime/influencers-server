import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/18/190841
const mapStateToProps = state => ({
	recommendBranches: state.recommendBranches,
	checker: state.checker,
});
const mapDispatchToProps = dispatch => ({ dispatch });

const mergeProps = (state, {dispatch}, props) => ({
	...props,
	loadRecommendData: () => dispatch(actions.loadUserRecommendData(props.userId)),
	dataLoaded: Object.keys(state.recommendBranches).length > 0,

	// RecommendToolbox
  addRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => {
				const id = state.checker.recommendBranchIds[0];
				dispatch(actions.addRecommendBranch(id, props.userId, state.recommendBranches));
			}
			: null
	,
  addSubRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => {
				// insert sub last branch.
				const parentId = state.checker.recommendBranchIds[0];
				dispatch(actions.addSubRecommendBranch(parentId, props.userId, state.recommendBranches))}
			: null
	,
  deleteRecommendBranches:
		state.checker.recommendBranchIds.length > 0
			? () => { dispatch(actions.deleteRecommendBranches(state.checker.recommendBranchIds)) }
			: null
	,
  moveUpRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => dispatch(actions.moveUpRecommendBranch(state.checker.recommendBranchIds[0] || state.checker.recommendIds[0], state))
		: null
	,
  moveDownRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => dispatch(actions.moveDownRecommendBranch(state.checker.recommendBranchIds[0] || state.checker.recommendIds[0], state))
		: null
	,
  moveRecommendBranches:
		(state.checker.recommendBranchIds.length >= 1 && 
		 (state.checker.recommendBranchIds.length + state.checker.recommendIds.length) >= 2
		) ? () => {
				// move to last recommendBranches
				let recommendBranchIds = Object.assign([], state.checker.recommendBranchIds);
				let recommendIds = Object.assign([], state.checker.recommendIds);
				const to = recommendBranchIds.pop();
				dispatch(actions.moveRecommendBranches([...recommendBranchIds, ...recommendIds], to, state)); 
			}
			: null
	,

});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendTree);

