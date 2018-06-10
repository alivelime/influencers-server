import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from 'modules/components/Link';


const styles = theme => ({
  hero: {
    minHeight: '80vh',
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.type === 'light' ? theme.palette.primary.dark : theme.palette.primary.main,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: '.7rem',
    textIndent: '.7rem',
    fontWeight: theme.typography.fontWeightLight,
    [theme.breakpoints.only('xs')]: {
      fontSize: 28,
    },
    whiteSpace: 'nowrap',
  },
  headline: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit,
    textAlign: 'center',
  },
  content: {
    paddingBottom: theme.spacing.unit * 8,
    paddingTop: theme.spacing.unit * 8,
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing.unit * 12,
    },
  },
	buttons: {
		textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  logo: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 4}px`,
		textShadow: '1px 1px 4px #fff,5px 5px 10px #888;',
  },
  steps: {
    maxWidth: theme.spacing.unit * 130,
    margin: 'auto',
  },
  step: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
  },
  stepIcon: {
    marginBottom: theme.spacing.unit,
  },
});

function HomePage(props) {
	const { classes } = props;
	return (
		<div className={classes.hero}>
		<div className={classes.content}>
			<div className={classes.text}>
				<Typography
					className={classes.logo}
					variant="display4"
					align="center"
					color="secondary"
				>InFlus
				</Typography>
				<Typography
					variant="display2"
					align="center"
					component="h1"
					color="inherit"
					gutterBottom
					className={classes.title}
				>
					{'「これイイよ!」'}<br />
					{'で繋がろう'}
				</Typography>
				<Typography
					variant="headline"
					component="h2"
					color="inherit"
					gutterBottom
					className={classes.headline}
				>
					{"誰もがインフルエンサーである時代へ"}
				</Typography>
			</div>
			<div className={classes.buttons}>
				<Button
					component={buttonProps => (
						<Link
							variant="button"
							to="/users/1"
							{...buttonProps}
						/>
					)}
					className={classes.button}
					variant="raised"
					color="primary"
				>
					{'登録'}
				</Button>
				<Button
					component={buttonProps => (
						<Link
							variant="button"
							to="/users/1"
							{...buttonProps}
						/>
					)}
					className={classes.button}
					variant="outlined"
					color="primary"
				>
					{'ログイン'}
				</Button>
			</div>
		</div>
	</div>
	);
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(HomePage);
