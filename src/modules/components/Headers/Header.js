import React from 'react';
import PropTypes from 'prop-types';

import Login from 'modules/components/Headers/Login';
import Guest from 'modules/components/Headers/Guest';

function Header(props) {
	const { classes } = props;
	if (props.login) {
		return <Login {...props} />
	} else {
		return <Guest {...props} />
	}
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);

