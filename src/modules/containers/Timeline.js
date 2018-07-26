import { connect } from 'react-redux'

import {loadTimeline} from 'modules/redux/user/actions'
import Timeline from 'modules/components/User/Timeline';

const mapStateToProps = state => ({
	user: state.user,
	timeline: state.timeline,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,

	user: state.user,
	timeline: {...state.timeline, users: {...state.timeline.users, [state.user.id]: state.user}},
	loadTimeline: () => dispatch(loadTimeline(props.userId)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(Timeline);

