import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import UserProfile from 'modules/containers/UserProfile';
import Timeline from 'modules/containers/Timeline';

const styleSheet = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2,
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: "1024pt",
    margin: 'auto',
	},
});

class  UserTimeline extends React.Component {

	render() {
		const { classes } = this.props;
	  const { id } = this.props.match.params;

		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<UserProfile id={id} />
				</div>
				<div className={classes.content}>
					<Timeline userId={id} />
				</div>
			</div>
		);
	}
}
UserTimeline.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(UserTimeline);

