import { connect } from 'react-redux'
import { logout } from 'modules/redux/user/actions'

import Header from 'modules/components/Headers/Header';

const mapStateToProps = state => ({
	user: state.session.user,
	isLogin: state.session.state === "login",
	session: state.session,
});
const mapDispatchToProps = (dispatch, props) => ({
	logout: () => {dispatch(logout())},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);


