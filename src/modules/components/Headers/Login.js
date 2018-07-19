import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Link from 'modules/components/Link';

const styles = {
  root: {
		flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
};

function Header(props) {
	const { classes } = props;
	return (
		<div className={classes.root}>
			<AppBar
				position='static'
			>
				<Toolbar>
					<Typography variant="title" color="inherit" className={classes.flex} >
            <Link to='/'>インフルず</Link>
          </Typography>
					<Link to={`/users/${props.session.user.id}`}>
						<Avatar src={props.session.user.avatar} />
					</Link>
					<Button
						color="primary"
						variant="contained"
						onClick={props.logout}
					>logout</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);

