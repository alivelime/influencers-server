import { connect } from 'react-redux'

import { loadUser, updateUser } from 'modules/redux/user/actions'
import Profile from 'modules/components/Profile';

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
export default connect(
	...props,
	data: state.user,
  loadUser: id => dispatch(loadUser(id)),
	updateUser: data => dispatch(updateUser(data)),
)(Profile);
