import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MyRecommendTree from 'modules/containers/MyRecommendTree';
import UserProfile from 'modules/containers/UserProfile';

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

	render() {
		const { classes } = this.props;
	  const { id, recommendBranchId, iineId, token } = this.props.match.params;

		return (
			<div className={classes.root}>
				<p>{token}</p>
				<div className={classes.content}>
					<UserProfile id={id} />
				</div>
				<div className={classes.content}>
					<MyRecommendTree
						userId={id}
						recommendBranchId={recommendBranchId || "0"}
						iineId={iineId}
					/>
				</div>
			</div>
		);
	}
}
User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(User);
