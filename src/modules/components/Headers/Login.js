import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Timeline from '@material-ui/icons/Timeline';

import Link from 'modules/components/Link';

const styles = theme => ({
	flexbox: {
		display: "flex",
		justifyCntent: 'center',
		alignItems: 'center',
	},
	icon: {
		maxHeight: '40pt',
		margin: theme.spacing.unit * 2,
	},
});

function Header(props) {
	const { classes } = props;
	return (
		<div className={classes.flexbox}>
			<Link to={`/users/${props.session.user.id}`} className={classes.icon}>
				<Avatar src={props.session.user.avatar} />
			</Link>
			<Link to={`/users/${props.id}/timeline`} className={classes.icon}>
				<Badge className={classes.margin} badgeContent={'?'} color="secondary">
					<Button variant="fab" color="primary">
						<Timeline />
					</Button>
				</Badge>
			</Link>
			<Button
				color="primary"
				variant="contained"
				onClick={props.logout}
			>logout</Button>
		</div>
	);
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);

