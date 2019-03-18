import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendToolbox from 'modules/components/RecommendToolbox';

// for performance reference http://anect.hatenablog.com/entry/2018/04/18/190841
const mapStateToProps = state => ({
	token: state.session.token,

	checker: state.checker,
	recommendBranches: state.recommendBranches,
});
const mapDispatchToProps = dispatch => ({ dispatch });

const mergeProps = (state, {dispatch}, props) => ({
	...props,

	// RecommendToolbox
  addRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => {
				const id = state.checker.recommendBranchIds[0];
				dispatch(actions.addRecommendBranch(id, props.userId, state.recommendBranches, state.token));
			}
			: null
	,
  addSubRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => {
				// insert sub last branch.
				const parentId = state.checker.recommendBranchIds[0];
				dispatch(actions.addSubRecommendBranch(parentId, props.userId, '', state.recommendBranches, state.token))}
			: null
	,
  deleteRecommendBranches:
		state.checker.recommendBranchIds.length > 0
			? () => { dispatch(actions.deleteRecommendBranches(state.checker.recommendBranchIds, state.token)) }
			: null
	,
  moveUpRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => dispatch(actions.moveUpRecommendBranch(
					state.checker.recommendBranchIds[0] || state.checker.recommendIds[0],
					state.recommendBranches,
					state.token))
		: null
	,
  moveDownRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => dispatch(actions.moveDownRecommendBranch(
					state.checker.recommendBranchIds[0] || state.checker.recommendIds[0],
					state.recommendBranches,
					state.token))
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
				dispatch(actions.moveRecommendBranches([...recommendBranchIds, ...recommendIds], to, state.recommendBranches, state.token)); 
				dispatch(actions.uncheckAll());
			}
			: null
	,
	openAll: () => dispatch(actions.openAllRecommendBranches()),
	closeAll: () => dispatch(actions.closeAllRecommendBranches()),

});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendToolbox);


