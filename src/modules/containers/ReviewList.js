import { connect } from 'react-redux';

import ReviewList from 'modules/components/ReviewList';

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const mapStateToProps = state => ({
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),
	myUserId: state.session.user.id,

	reviews: state.reviews,
	recommends: state.recommends,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	return {
		...props,
		isMine: state.isMine,
		myUserId: state.myUserId,

		reviews: getReviewList(state.reviews, props.recommendBranchId, state.recommends),
	}
};

function getReviewList(_reviews, recommendBranchId, _recommends) {
	return Object.keys(_reviews).filter((id) => {
		return _reviews[id].recommendBranchId === recommendBranchId;
	})
	.map(id => ({..._reviews[id], meta: _reviews[id].evidence ? _recommends[_reviews[id].evidence] : null}))
	.sort((a, b) => {return b.createdAt - a.createdAt});
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(ReviewList);
