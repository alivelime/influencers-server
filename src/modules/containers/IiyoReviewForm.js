import { connect } from 'react-redux'

import { loadUser, updateUser } from 'modules/redux/user/actions'
import ReviewFrom from 'modules/components/ReviewForm';

const mapStateToProps = (state, ownProps) => ({
	data: state.user,
})

const mapDispatchToProps = dispatch => ({
  loadUser: id => dispatch(loadUser(id)),
	updateUser: data => dispatch(updateUser(data)),
})

const selector = formValueSelector('reviewForm');
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
		...props,
		initialValues: state.reviewForm.data,
		recommendBranchId: state.reviewForm.recommendBranchId,
		recommendPreview: state.reviewForm.recommendPreview,
		evidencePreview: state.reviewForm.evidencePreview,

		(() => {
			// searchRecommendBranch(url)[0] > this.props.recommendBranchId > "0" ...
			let recommendBranchId = "0";
			if (props.url) {
				const recommendBranchIds = searchRecommendBranchIds(props.url);
				if (recommendBranchIds.length > 0) {
					recommendBranchId = recommendBranchIds[0];
				}
			} else {
				if (props.recommendBranchId) {
					recommendBranchId = props.recommendBranchId;
				}
			}

			return {
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
		})(),
    name: state.user.name,
    onSubmit: await () => {
      const token = state.user.token;
      const name = state.edit.name;
      const response = await fetch(...);
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(reduxForm({
	form: 'reviewForm' // a unique identifier for this form
})(reviewForm);
