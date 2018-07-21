import { connect } from 'react-redux';

import * as actions from 'modules/redux/user/actions';
import Review from 'modules/components/Review';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = state => ({
	myUserId: state.session.user.id,
	reviews: state.reviews,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	return {
		...props,
		reviews: getReviewList(state.reviews, props.recommendBranchId),
	}
};

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



