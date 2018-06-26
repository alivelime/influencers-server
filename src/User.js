import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import UserProfile from 'modules/components/UserProfile';
import RecommendTree from 'modules/components/RecommendTree';
import userReducer from 'modules/redux/user/reducers'

const styleSheet = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    maxWidth: theme.spacing.unit * 160,
    margin: 'auto',
	},
	header: {
		padding: theme.spacing.unit * 2,
	},
});

class  User extends React.Component {
	state = {
		store = createStore(userReducer)
	};

	render() {
		const { classes } = this.props;
	  const { id } = this.props.match.params;

		return (
			<Provider store={this.state.store} >
				<div className={classes.root}>
					<div className={classes.content}>
						<UserPrifile id={id} />
					</div>
					<div className={classes.content}>
						<RecommendTree userId={id} />
					</div>
				</div>
			</Provider>
		);
	}
}
User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(User);
