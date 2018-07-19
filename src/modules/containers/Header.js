import { connect } from 'react-redux'
import { logout } from 'modules/redux/user/actions'

import Header from 'modules/components/Headers/Header';

const mapStateToProps = state => ({
	login: state.session.login,
	user: state.session.user,
});
const mapDispatchToProps = (dispatch, props) => ({
	logout: dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);


