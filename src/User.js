import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

import Link from 'modules/components/Link';

import RecommendTree from 'modules/containers/RecommendTree';
import UserProfile from 'modules/containers/UserProfile';

const styleSheet = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2,
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: "1024pt",
    margin: 'auto',
	},
	margin: {
    margin: theme.spacing.unit * 2,
  },
	button: {
    width: '100%',
  },
});

class  User extends React.Component {

	render() {
		const { classes } = this.props;
	  const { id, recommendBranchId, iineId } = this.props.match.params;

		return (
			<div className={classes.root}>
				<div className={classes.content}>
					<UserProfile id={id} />
				</div>
				<div className={classes.content}>
					<Link to={`/users/${id}/timeline`}>
						<Badge className={classes.margin} badgeContent={'?'} color="secondary">
							<Button className={classes.button} variant="raised" color="primary" size="large">タイムラインを確認</Button>
						</Badge>
					</Link>
				</div>
				<div className={classes.content}>
					<RecommendTree
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
