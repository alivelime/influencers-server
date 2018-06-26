import { connect } from 'react-redux'

import { loadUser, setUser } from 'modules/redux/user/actions'
import Profile from 'modules/components/Profile';

const mapStateToProps = (state, ownProps) => ({
	user: state.user,
})

const mapDispatchToProps = dispatch => ({
  loadUser: id => dispatch(loadUser(id)),
	setUser: data => dispatch(setUser(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
