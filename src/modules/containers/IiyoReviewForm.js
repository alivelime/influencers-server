import { connect } from 'react-redux'
import { reduxForm, formValueSelector, reset } from 'redux-form'

import * as actions from 'modules/redux/user/actions'
import * as validation from 'modules/utils/validation'
import ReviewForm from 'modules/components/ReviewForm';

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
	token: state.session.token,

	recommendBranchId: state.reviewForm.recommendBranchId,
	isRecommend: state.reviewForm.isRecommend,

	url: selector(state, 'url'),
	evidence: selector(state, 'evidence'),

	recommendBranches: state.recommendBranches,
	recommends: state.recommends,
	reviews: state.reviews,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,

	initialValues: initialValues,
	recommendPreview: (state.url in state.recommends)
		? state.recommends[state.url]
		: (validation.isURL(state.url) ? dispatch(actions.getRecommendPreview(state.url)) : null),
	evidencePreview: (state.evidence in state.recommends)
		? state.recommends[state.evidence] 
		: (validation.isURL(state.evidence) ? dispatch(actions.getEvidencePreview(state.evidence)) : null),

	recommendBranchName: (state.recommendBranchId === "0")
		? "トップ(自動選択)"
		: state.isRecommend
			? (state.recommendBranches[state.recommendBranchId].parentId === "0" 
				? `トップ${state.recommendBranchId}` 
				: state.recommendBranches[state.recommendBranches[state.recommendBranchId].parentId].name)
			: state.recommendBranches[state.recommendBranchId].name
	,
	handleURLChange: event => {
		const url = event.target.value;
		if (!validation.isURL(url)) {
			return;
		}

		if (state.recommendBranchId === "0" || state.isRecommend) {
			const recommendBranchIds = searchRecommendBranchIds(state.reviews, url);
			if (recommendBranchIds.length > 0) {
				dispatch(actions.setRecommendBranchId(recommendBranchIds[0], true));
			} else {
				dispatch(actions.setRecommendBranchId("0", false));
			}
		}
	},

	onSubmit: value => 
	{
		// do not dispatch addRecommends here.
		dispatch(actions.addReview(state.recommendBranchId, state.isRecommend, {
			review: {
				userId: props.userId,
				recommendBranchId: null, // change whether if recommendBranchId has recommend or not.
				recommendId: value.url,
				iineId: props.iineId || "0",
				evidence: value.evidence,
				memo: String(value.memo), // must string.
				forMe: value.forMe,
				forYou: value.forYou,
			},
			recommend: {
				url: value.url,
				link: value.url,
				kind: value.kind,
				Description: "",
			},
			evidence: {
				url: value.evidence,
				kind: "information",
			},
			recommendBranches: state.recommendBranches,
		}, state.token));

		dispatch(actions.uncheckAll());
		dispatch(reset('reviewForm')); 
	},

	clearURL: () => dispatch(actions.clearURL()),
	clearEvidence: () => dispatch(actions.clearEvidence()),
	clearMemo: () => dispatch(actions.clearMemo()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(reduxForm({
	form: 'reviewForm' // a unique identifier for this form
})(ReviewForm));
