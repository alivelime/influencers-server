import { connect } from 'react-redux'

import { loadUser, updateUser, deleteUser, loadAffiliate, updateAffiliate } from 'modules/redux/user/actions'
import Profile from 'modules/components/User/Profile';

const mapStateToProps = state => ({
	user: state.user,
	session: state.session,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,

	loadUser: () => dispatch(loadUser(props.id)),
	updateUser: data => dispatch(updateUser(props.id, data, state.session.token)),
	deleteUser: () => dispatch(deleteUser(props.id, state.session.token)),

	loadAffiliate: () => dispatch(loadAffiliate(props.id)),
	updateAffiliate: data => dispatch(updateAffiliate(props.id, data, state.session.token)),

	data: state.user,
	isMine: (state.session.user.id !== undefined && state.user.id === state.session.user.id),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(Profile);
