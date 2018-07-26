import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Link from 'modules/components/Link';

import Login from 'modules/components/Headers/Login';
import Guest from 'modules/components/Headers/Guest';

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
				position='fixed'
			>
				<Toolbar>
					<Typography variant="title" color="inherit" className={classes.flex} >
            <Link to='/'>インフルず(β)</Link>
          </Typography>
					{props.isLogin 
						? <Login session={props.session} logout={props.logout}/> 
						: <Guest location={props.location}/>
					} 
				</Toolbar>
			</AppBar>
		</div>
	);
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);

