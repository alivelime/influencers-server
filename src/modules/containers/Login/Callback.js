import React from 'react';
import { connect } from 'react-redux'

import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button'

import { fetchLoginUser } from 'modules/redux/user/actions'

const mapStateToProps = state => ({
	session: state.session,
});
const mapDispatchToProps = (dispatch, props) => ({
	fetchLoginUser: (sns, token) => dispatch(fetchLoginUser(sns, token)),
});

class Callback extends React.Component {
	componentWillMount() {
	  const { sns, token } = this.props.match.params;
		this.props.fetchLoginUser(sns, token);
	}

	render() {
	  const { session } = this.props;
	  const { redirect } = this.props.match.params;

		if (!session || session.state === "") {
			return (<p>ログインしています</p>)
		}

		// TODO Terms of use.
		if (session.state === "register") {
			return (
				<div>
					<p>service {this.props.session.user.snsType}</p>
					<p>id {this.props.session.user.id}</p>
					<p>name {this.props.session.user.name}</p>
					<p>avator {this.props.session.user.avator}</p>
					<Button>register</Button>
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

