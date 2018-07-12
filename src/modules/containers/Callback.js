import { connect } from 'react-redux'

import { fetchSessionUser } from 'modules/redux/user/actions'

const mapStateToProps = state => ({
	session: state.session,
});
const mapDispatchToProps = (dispatch, props) => ({
	fetchLoginUser: (token) => dispatch(fetchLoginUser(props.match.params.sns, props.match.params.token)),
	registerUser: (token) => dispatch(registerUser(props.match.params.sns, props.match.params.token)),
});

class Callback extends React.Component {
	componentWillMount() {
		this.props.fetchLoginUser();
	}

	render() {
	  const { session } = this.props;
	  const { redirect } = this.props.match.params;

		if (!session || !session.state) {
			return (<p>ログインしています</p>)
		}

		// TODO Terms of use.
		if (session.state === "register") {
			return (
				<div>
					<p>{this.session.user.screenName)</p>
					<Button onClick={this.props.register} >Register</Button>
				</div>
			);
		}
		if (session.state === "login") {
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

