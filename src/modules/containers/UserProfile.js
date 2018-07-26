import { connect } from 'react-redux'

import { loadUser, updateUser, clearUser, loadAffiliate, clearAffiliate, updateAffiliate } from 'modules/redux/user/actions'
import Profile from 'modules/components/User/Profile';

const mapStateToProps = state => ({
	user: state.user,
	token: state.session.token,
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => {
	console.log('UserPrifile mergeProps ' + props.id);
	return	{
	...props,
	user: state.user,
	isMine: state.isMine,

	loadUser: () => dispatch(loadUser(props.id)),

	// for login user.
	updateUser: data => dispatch(updateUser(props.id, data, state.token)),
	clearUser: () => dispatch(clearUser()),
	loadAffiliate: () => dispatch(loadAffiliate(props.id)),
	clearAffiliate: () => dispatch(clearAffiliate()),
	updateAffiliate: data => dispatch(updateAffiliate(props.id, data, state.token)),
}};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(Profile);
