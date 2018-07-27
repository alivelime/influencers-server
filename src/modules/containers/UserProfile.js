import { connect } from 'react-redux'

import * as actions from 'modules/redux/user/actions'
import Profile from 'modules/components/User/Profile';

const mapStateToProps = state => ({
	user: state.user,
	myUserId: state.session && state.session.user && state.session.user.id,
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
	myUserId: state.myUserId,

	loadUser: () => dispatch(actions.loadUser(props.id)),

	// follow
	loadUserFollow: () => dispatch(actions.loadUserFollow(props.id)),
	loadUserFollower: () => dispatch(actions.loadUserFollower(props.id)),
	handleFollow: (state.myUserId && !state.isMine
		? () => {
				if (state.user.followerIds.includes(state.myUserId)) {
					dispatch(actions.unfollowUser(state.myUserId, state.user.id, state.token));
				} else {
					dispatch(actions.followUser(state.myUserId, state.user.id, state.token));
				}
			}
		: Function.prototype
	),
	isFollow: (state.myUserId
		? state.user.followerIds.includes(state.myUserId)
		: false
	),

	// for login user.
	updateUser: data => dispatch(actions.updateUser(props.id, data, state.token)),
	clearUser: () => dispatch(actions.clearUser()),

	loadAffiliate: () => dispatch(actions.loadAffiliate(props.id)),
	clearAffiliate: () => dispatch(actions.clearAffiliate()),
	updateAffiliate: data => dispatch(actions.updateAffiliate(props.id, data, state.token)),

}};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(Profile);
