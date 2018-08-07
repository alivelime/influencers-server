import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import Login from 'modules/components/Login';
import Ranking from 'modules/components/Ranking';

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
});

class HomePage extends React.Component {

	render() {
		const { classes } = this.props;
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
						<Login>
							<Button
								className={classes.button}
								variant="raised"
								color="primary"
							>
								{'SIGN IN/LOG IN'}
							</Button>
						</Login>
					</div>
					<Divider />
					<div className={classes.content}>
						<Typography
							variant="headline"
							gutterBottom
							className={classes.headline}
						>
						「この広告消せないかな?」<br />
						そんなふとした想いからこのサイトは始まりました。<br />
						</Typography>
					</div>
					<Divider />
					<div className={classes.content}>
						<Ranking />
					</div>
				</div>
			</div>
		);
	}
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(HomePage);
