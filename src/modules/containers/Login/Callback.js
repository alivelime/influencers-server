import { connect } from 'react-redux'

import { fetchSessionUser } from 'modules/redux/user/actions'

const mapStateToProps = state => ({
	session: state.session,
});
const mapDispatchToProps = (dispatch, props) => ({
	fetchLoginUser: (token) => dispatch(fetchLoginUser(token)),
});

class Callback extends React.Component {
	componentWillMount() {
	  const { token } = this.props.match.params;
		this.props.fetchLoginUser(token);
	}

	render() {
	  const { session } = this.props;
	  const { token, redirect } = this.props.match.params;

		if (!session) {
			return (<p>ログインしています</p>)
		}

		// TODO Terms of use.

		if (session.login) {
			return (
				<Redirect to={window.atob(redirect)} />
			);
		}
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Callback);

