import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

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
		return (	
			<div>{children}</div>
		);
	} else if (to.startsWith('http')) {
		return (
			<a href={to}
				 className={classNames(classes.root, classes[variant])}
				 target="new"
				 rel="noopener noreferrer"
			 {...props} >{children}</a>
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
  to: PropTypes.string.isRequired,
  prefetch: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'button']),
};

export default withStyles(styles)(Link);
