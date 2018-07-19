import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styleSheet = theme => ({
	content: {
		padding: theme.spacing.unit * 2,
	},
});

class Profile extends React.Component {

	render() {
		const { classes, data } = this.props;

		return (
			<Paper className={classes.content}>
				<Typography variant="body1">{data.memo}</Typography>
			</Paper>
		);
	}

}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Profile);

