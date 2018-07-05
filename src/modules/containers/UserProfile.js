import { connect } from 'react-redux'

import { loadUser, updateUser } from 'modules/redux/user/actions'
import Profile from 'modules/components/Profile';

const mapStateToProps = state => ({
	data: state.user,
});
const mapDispatchToProps = (dispatch, props) => ({
	loadUser: () => dispatch(loadUser(props.id)),
	updateUser: () => dispatch(updateUser()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
