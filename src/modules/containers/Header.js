import { connect } from 'react-redux'
import { logout } from 'modules/redux/user/actions'

import Header from 'modules/components/Headers/Header';

const mapStateToProps = state => ({
	login: state.session.login,
	name: state.session.screenName,
	avator: state.session.avator,
	userId: state.session.userId,
});
const mapDispatchToProps = (dispatch, props) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);


