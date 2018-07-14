import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";

import Register from 'modules/components/Register';
import * as actions from 'modules/redux/user/actions'

const mapStateToProps = state => ({
	session: state.session,
});
const mapDispatchToProps = (dispatch, props) => ({
	fetchLoginUser: (sns, token) => dispatch(actions.fetchLoginUser(sns, token)),
	registerUser: (sns, token) => dispatch(actions.registerUser(sns, token)),
});

class Callback extends React.Component {
	componentWillMount() {
	  const { sns, token } = this.props.match.params;
		this.props.fetchLoginUser(sns, token);
	}

	render() {
	  const { session } = this.props;
	  const { sns, token, redirect } = this.props.match.params;

		if (!session || session.state === "") {
			return (<p>ログインしています</p>)
		}

		// TODO Terms of use.
		if (session.state === "register") {
			return (
				<Register {...this.props} register={() => {this.props.registerUser(sns, token)}} />
			);
		}

		if (session.state === "login") {
			return (
				<Redirect to={redirect ? window.atob(redirect) : `/users/${this.props.session.user.id}`} />
			);
		}
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Callback);

