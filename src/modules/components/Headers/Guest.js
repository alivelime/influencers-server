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

	render () {
		const { classes } = this.props;
		return (
			<div className={classes.flexbox}>
				<Login redirect={this.props.location.pathname} >
					<Button
						variant="contained"
						color="primary"
					>{`SIGN IN/LOG IN`}</Button>
				</Login>
			</div>
		);
	}
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
