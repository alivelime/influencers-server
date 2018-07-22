import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendBranchName from 'modules/components/RecommendBranchName';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = (state, props) => ({
	token: state.session.token,
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),

	name: state.recommendBranches[props.id].name,
	recommendId: state.recommendBranches[props.id].recommendId,
	recommends: state.recommends,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	console.log("RecommendBranchName mergeProps "+props.id);

	return {
		...props,
		isMine: state.isMine,
		name: state.name,
		recommend: state.recommendId
		? state.recommends[state.recommendId]
		: null,

		handleSubmit: name => {dispatch(actions.updateRecommendBranch({id: props.id, name: name}, state.token))},
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendBranchName);

