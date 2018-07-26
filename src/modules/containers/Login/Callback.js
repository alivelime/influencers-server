import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";

import Register from 'modules/components/Register';
import * as actions from 'modules/redux/user/actions'
import { MY_PAGE } from 'config';

const mapStateToProps = state => ({
	session: state.session,
});
const mapDispatchToProps = (dispatch, props) => ({
	fetchLoginUser: (sns, token) => dispatch(actions.fetchLoginUser(sns, token)),
	registerUser: (sns, token) => dispatch(actions.registerUser(sns, token)),
});

class Callback extends React.Component {
	componentDidMount() {
	  const { sns, token } = this.props.match.params;
		this.props.fetchLoginUser(sns, token);
	}

	render() {
	  const { session } = this.props;
	  const { sns, token, redirect } = this.props.match.params;

		if (!session || session.state === "") {
			return (<p>ログインしています</p>)
		}

		if (session.state === "register") {
			return (
				<Register {...this.props} register={() => {this.props.registerUser(sns, token)}} />
			);
		}

		if (session.state === "login") {
			let to = redirect ?  window.atob(redirect) : null;
			const mypage = `/users/${this.props.session.user.id}`
			if (!to || to === '/') {
				to = mypage;
			} else {
				to = to.replace(MY_PAGE, mypage);
			}
			return (
				<Redirect to={to} />
			);
		}
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Callback);

