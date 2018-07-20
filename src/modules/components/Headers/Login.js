import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import Link from 'modules/components/Link';

const styles = {
	flexbox: {
		display: "flex",
	},
};

function Header(props) {
	const { classes } = props;
	return (
		<div className={classes.flexbox}>
			<Link to={`/users/${props.session.user.id}`}>
				<Avatar src={props.session.user.avatar} />
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

