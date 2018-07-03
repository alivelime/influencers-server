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

// for performance reference http://anect.hatenablog.com/entry/2018/04/05/124654
const selector = formValueSelector('reviewForm');
const mapStateToProps = state => ({
	recommendBranchId: state.reviewForm.recommendBranchId,
	isRecommend: state.reviewForm.isRecommend,
	recommendPreview: state.reviewForm.recommendPreview,
	evidencePreview: state.reviewForm.evidencePreview,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,
	initialValues: initialValues,
	handleURLChange: (url) => {
		if (!validation.isURL(url)) {
			dispatch(actions.setRecommendBranchId("0"));
			dispatch(actions.previewRecommend(null);
			return;
		}

		const recommendBranchIds = searchRecommendBranchIds(props.url);
		if (recommendBranchIds.length > 0) {
			dispatch(actions.setRecommendBranchId(recommendBranchIds[0], true));
		}
		dispatch(actions.previewRecommend(url);
	},
	handleEvidenceChange: (url) => {
		if (!validation.isURL(url)) {
			dispatch(actions.previewReview(null);
			return;
		}
		dispatch(actions.previewReview(url);
	},
	handleSubmit: values => 
	{
		const recommend = {
			url: value.url,
			link: value.url,
			kind: value.kind,
			Description: "",
		};
		const review = {
			userId: this.props.userId,
			recommendBranchId: null,
			recommendId: value.url,
			iineId: this.props.iineId || "0",
			evidence: value.evidence,
			memo: String(value.memo),
			forMe: value.forMe,
			forYou: value.forYou,
		};
		dispatch(actions.addReview(state.recommendBranchId, recommend, review));

		try {

			// if recommend branch does not have same review. add sub recommend branch.
			let addFlag = false;
			if (isRecommend) {
				addFlag = true;
			}
			const recommendBranchId = (addFlag 
				 ? (await this.props.data.addSubRecommendBranch(this.state.recommendBranchId)).id
				 : this.state.recommendBranchId);

			res = await postAPI(`/api/reviews`, {
				userId: this.props.userId,
				recommendBranchId: recommendBranchId,
				recommendId: this.state.url,
				iineId: this.props.iineId,
				evidence: this.state.evidence,
				memo: String(this.state.memo),
				forMe: this.state.forMe,
				forYou: this.state.forYou,
			});

			if (Object.keys(res).length === 0) {
				this.setState({urlError: true, urlHelper: '登録に失敗しました'});
				if (addFlag) {
					this.props.data.deleteRecommendBranch([recommendBranchId]);
				}
				return;
			}

		}

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
