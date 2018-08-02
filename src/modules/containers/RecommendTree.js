import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/18/190841
const mapStateToProps = state => ({
	token: state.session.token,
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),
	recommendBranches: state.recommendBranches,
});
const mapDispatchToProps = dispatch => ({ dispatch });

const mergeProps = (state, {dispatch}, props) => ({
	...props,
	isMine: state.isMine,

	loadRecommendData: () => dispatch(actions.loadUserRecommendData(props.userId, state.token)),
	clearRecommendData: () => dispatch(actions.clearUserRecommendData()),
	openAll: () => dispatch(actions.openAllRecommendBranches()),
	closeAll: () => dispatch(actions.closeAllRecommendBranches()),
	dataLoaded: Object.keys(state.recommendBranches).length > 0,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendTree);

