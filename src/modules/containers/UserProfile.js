import { connect } from 'react-redux'

import { loadUser, updateUser } from 'modules/redux/user/actions'
import Profile from 'modules/components/Profile';

const mapStateToProps = (state, ownProps) => ({
	data: state.user,
})

const mapDispatchToProps = dispatch => ({
  loadUser: id => dispatch(loadUser(id)),
	updateUser: data => dispatch(updateUser(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
