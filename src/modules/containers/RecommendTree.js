import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendTree from 'modules/components/RecommendTree';

// for performance reference http://anect.hatenablog.com/entry/2018/04/18/190841
const mapStateToProps = state => ({
	token: state.session.token,
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),
});
const mapDispatchToProps = dispatch => ({ dispatch });

const mergeProps = (state, {dispatch}, props) => ({
	...props,

	loadRecommendData: () => dispatch(actions.loadUserRecommendData(props.userId, state.token)),
	dataLoaded: Object.keys(state.recommendBranches).length > 0,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendTree);

