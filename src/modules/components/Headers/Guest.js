import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import Login from 'modules/components/Login';

const styles = theme => ({
	flexbox: {
		display: "flex",
	},
});

class Header extends React.Component {
	state = {
		open: false,
	};

	render () {
		const { classes } = this.props;
		return (
			<div className={classes.flexbox}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {this.setState({open: true})}}
				>{`LOGIN / SIGNIN`}</Button>
				<Login
					open={this.state.open}
					onClose={() => {this.setState({open: false})}}
				/>
			</div>
		);
	}
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
