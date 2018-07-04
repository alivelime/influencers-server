import { connect } from 'react-redux'

import { loadUser, updateUser } from 'modules/redux/user/actions'
import ReviewFrom from 'modules/components/ReviewForm';

const initialValues = {
	kind: 'mono',
	url: '',
	evidence: '',
	memo: '',
	forMe: 3,
	forYou: 3,
	date: (new Date()).getFullYear() + '-'
			+ ("0"+((new Date()).getMonth()+1)).slice(-2) + '-'
			+ ("0"+(new Date()).getDate()).slice(-2),
};
const searchRecommendBranchIds = (reviews, url) => {
	return Object.keys(reviews).filter((id) => {
		return reviews[id].recommendId === url;
	})
	.map((id) => {
		return reviews[id].recommendBranchId;
	});
};

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const selector = formValueSelector('reviewForm');
const mapStateToProps = state => ({
	recommendBranchId: state.reviewForm.recommendBranchId,
	isRecommend: state.reviewForm.isRecommend,

	url: selector(state, 'url'),
	evidence: selector(state, 'evidence'),

	recommendBranches: state.recommendBranches,
	reviews: state.reviews;
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,

	initialValues: initialValues,
	recommendPreview: (state.url in state.recommends)
		? state.recommends[url]
		: dispatch(actions.getPreview(url)),
	evidencePreview: (state.evidence in state.recommends)
		? state.recommend[evidence] 
		: dispatch(actions.getPreview(evidence)),

	recommendBranchName: (state.recommendBranchId === "0")
		? "トップ(自動選択)"
		: state.isRecommend
			? state.recommendBranches[state.recommendBranchId].paretnId === "0" 
				? `トップ${state.recommendBranchId}` 
				: state.recommendBranches[state.recommendBranches[state.recommendBranchId].parentId]).name,
			: state.recommendBranches[state.recommendBranchId].name
	,
	handleURLChange: (url) => {
		if (!validation.isURL(url)) {
			return;
		}

		if (state.recommendBranchId === "0" || state.isRecommend)
			const recommendBranchIds = searchRecommendBranchIds(reviews, url);
			if (recommendBranchIds.length > 0) {
				dispatch(actions.setRecommendBranchId(recommendBranchIds[0], true));
			} else {
				dispatch(actions.setRecommendBranchId("0", false));
			}
		}
	},

	handleSubmit: values => 
	{
		dispatch(actions.addRecommend({
			url: value.url,
			link: value.url,
			kind: value.kind,
			Description: "",
		}));
		dispatch(actions.addReview(state.recommendBranchId, state.isRecommend, {
			userId: props.userId,
			recommendBranchId: null, // change whether if recommendBranchId has recommend or not.
			recommendId: value.url,
			iineId: props.iineId || "0",
			evidence: value.evidence,
			memo: String(value.memo), // must string.
			forMe: value.forMe,
			forYou: value.forYou,
		}));

		if (value.evidence.length > 0) {
			dispatch(actions.addEvidence({
				url: value.evidence,
				kind: "information",
			});
		}

		dispatch(actions.uncheckAll());
		props.reset();
	},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(reduxForm({
	form: 'reviewForm' // a unique identifier for this form
})(reviewForm));
