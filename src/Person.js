import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import RecommendTree from 'modules/components/RecommendTree';

const styleSheet = theme => ({
  root: {
	},
	content: {
    paddingBottom: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 4,
    maxWidth: theme.spacing.unit * 110,
    margin: 'auto',
	},
	header: {
		padding: theme.spacing.unit * 2,
	},
});

function Person(props) {
  const { classes } = props;

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<Paper>
					<div className={classes.header}>
						<Typography
							className={classes.logo}
							variant="display2"
						>私
						</Typography>
					</div>
				</Paper>
			</div>
			<div className={classes.content}>
				<RecommendTree />
			</div>
		</div>
	);
}
Person.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Person);
