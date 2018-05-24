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
  const { classes, variant } = props;
  return <NavLink className={classNames(classes.root, classes[variant])} {...props} />;
}

Link.defaultProps = {
  variant: 'default',
  activeClassName: 'active',
};

Link.propTypes = {
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
  prefetch: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'button']),
};

export default withStyles(styles)(Link);
