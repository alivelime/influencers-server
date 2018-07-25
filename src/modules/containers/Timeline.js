import { connect } from 'react-redux'

import {loadTimeline} from 'modules/redux/user/actions'
import Timeline from 'modules/components/User/Timeline';

const mapStateToProps = state => ({
	timeline: state.timeline,
});
const mapDispatchToProps = dispatch => ({ dispatch });
const mergeProps = (state, {dispatch}, props) => ({
	...props,

	timeline: state.timeline,
	loadTimeline: () => dispatch(loadTimeline(props.userId)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
	mergeProps
)(Timeline);

