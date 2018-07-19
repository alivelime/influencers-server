import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Login from 'modules/components/Login';
import Link from 'modules/components/Link';

const styles = theme => ({
  root: {
		flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
	button: {
		color: theme.palette.primary.main,
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
	},
});

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
							variant="contained"
							color="primary"
							onClick={() => {this.setState({open: true})}}
						>{`LOGIN / SIGNIN`}</Button>
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
