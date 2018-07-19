import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Typography';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Login from 'modules/components/Login';
import Link from 'modules/components/Link';

const styles = {
  root: {
		flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
};

class Header extends React.Component {
	state = {
		open: false,
	};

	render () {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<AppBar
					position='static'
				>
					<Toolbar>
						<Typography variant="title" color="inherit" className={classes.flex} >
							<Link to='/'>インフルず</Link>
						</Typography>
						<Button
							color="primary"
							onClick={() => {this.setState({open: true})}}
						>SIGN/LOG IN</Button>
						<Login
							open={this.state.open}
							onClose={() => {this.setState({open: false})}}
						/>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
