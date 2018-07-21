import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import RecommendBranchName from 'modules/components/RecommendBranchName';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = (state, props) => ({
	token: state.session.token,
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),

	name: state.recommendBranches[props.id].name,
	recommend: state.recommendBranches[props.id].recommendId
		? state.reviews[state.recommendBranches[props.id].recommendId] 
		: null,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	console.log("RecommendBranchName mergeProps "+props.id);

	return {
		...props,

		handleSubmit: name => {dispatch(actions.updateRecommendBranch({id: props.id, name: name}, state.token))},
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(RecommendBranch);




