import { connect } from 'react-redux'

import * from 'modules/redux/user/actions'
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
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
					prevId: id,
					nextId: (id === "0" ? "0" : state.recommendBranches[id].nextId),
				}))}
			: null
	,
  addSubRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => { dispatch(actions.addSubRecommendBranch(state.checker.recommendBranchIds[0])) }
			: null
	,
  deleteRecommendBranches:
		state.checker.recommendBranchIds.length > 0
			? () => { dispatch(actions.deleteRecommendBranches(state.checker.recommendBranchIds)) }
			: null
	,
  moveUpRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => {
			if (state.checker.recommendBranchIds.length === 1) {
				dispatch(actions.moveUpRecommendBranch(state.checker.recommendBranchIds)); 
			} else if (state.checker.recommendIds.length === 1) {
				dispatch(action.moveUpRecommendBranch(state.checker.recommendIds)); 
			}
		}
		: null
	,
  moveDownRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => {
			if (state.checker.recommendBranchIds.length === 1) {
				dispatch(actions.moveDownRecommendBranch(state.checker.recommendBranchIds)); 
			} else if (state.checker.recommendIds.length === 1) {
				dispatch(actions.moveDownRecommendBranch(state.checker.recommendIds)); 
			}
		}
		: null
	,
  moveRecommendBranches:
		(state.checker.recommendBranchIds.length >= 1 && 
		 (state.checker.recommendBranchIds.length + state.checker.recommendIds.length) >= 2
		) ? () => { dispatch(actions.moveRecommendBranches(state.checker.recommendBranchIds, state.checker.recommendIds)) }
			: null
	,

});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendTree);

