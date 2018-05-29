import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styleSheet = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 8,
    paddingTop: theme.spacing.unit * 8,
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing.unit * 12,
    },
	},
});

function NotFound(props) {
  const { classes } = props;

	return (
		<div className={classes.root}>
			<Typography
				className={classes.logo}
				variant="display4"
				align="center"
			>404 Not Found
			</Typography>
		</div>
	);
}
NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(NotFound);

