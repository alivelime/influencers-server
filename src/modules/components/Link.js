import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import ReactGA from 'react-ga';

const styles = theme => ({
  root: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  default: {
    color: 'inherit',
  },
  primary: {
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.secondary.main,
  },
  button: {
    '&:hover': {
      textDecoration: 'inherit',
    },
  },
});

function Link(props) {
  const { classes, variant, to, children } = props;
	let component;
	if (!to || to.length === 0) {
		return children;
	} else if (to.startsWith('http')) {
		return (
			<ReactGA.OutboundLink
				className={classNames(classes.root, classes[variant])}
        eventLabel="outbound"
        to={to}
				rel="noopener noreferrer"
        target="_blank"
			>
				{children}
      </ReactGA.OutboundLink>		
		);
	} else if(to.length > 0) {
		return (
				<NavLink className={classNames(classes.root, classes[variant])} {...props} >{children}</NavLink>
		);
	}
	return component;
}

Link.defaultProps = {
  variant: 'default',
};

Link.propTypes = {
  className: PropTypes.string,
  prefetch: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'button']),
};

export default withStyles(styles)(Link);
