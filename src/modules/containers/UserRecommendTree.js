import { connect } from 'react-redux'

import { loadUserRecommendData } from 'modules/redux/user/actions'
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,
	dataLoaded: Object.keys(state.recommendBranches).length > 0,
	loadUserRecommendData: () => dispatch(loadUserRecommendData(props.userId)),

	// RecommendToolbox
  addRecommendBranch: 
		state.checker.recommendBranchIds.length === 1
			? () => { dispatch(addRecommendBranch(state.checker.checkdRecommendIds[0]))}
			: null
	,
  addSubRecommendBranch:
		state.checker.recommendBranchIds.length === 1
			? () => { dispatch(addSubRecommendBranch(state.checker.recommendBranchIds[0])) }
			: null
	,
  deleteRecommendBranches:
		state.checker.recommendBranchIds.length > 0
			? () => { dispatch(deleteRecommendBranches(state.checker.recommendBranchIds)) }
			: null
	,
  moveUpRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => {
			if (state.checker.recommendBranchIds.length === 1) {
				dispatch(moveUpRecommendBranch(state.checker.recommendBranchIds)); 
			} else if (state.checker.recommendIds.length === 1) {
				dispatch(moveUpRecommendBranch(state.checker.recommendIds)); 
			}
		}
		: null
	,
  moveDownRecommendBranch:
		((state.checker.recommendBranchIds.length + state.checker.recommendIds.length) === 1)
		? () => {
			if (state.checker.recommendBranchIds.length === 1) {
				dispatch(moveDownRecommendBranch(state.checker.recommendBranchIds)); 
			} else if (state.checker.recommendIds.length === 1) {
				dispatch(moveDownRecommendBranch(state.checker.recommendIds)); 
			}
		}
		: null
	,
  moveRecommendBranches:
		(state.checker.recommendBranchIds.length >= 1 && 
		 (state.checker.recommendBranchIds.length + state.checker.recommendIds.length) >= 2
		) ? () => { dispatch(moveRecommendBranches(state.checker.recommendBranchIds, state.checker.recommendIds)) }
			: null
	,

});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendTree);

