import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const styles = theme => ({
	div: {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
	},
	twitter: {
		width: '320px',
		backgroundColor: '#1DA1F2',
    margin: theme.spacing.unit,
	},
	twitterLink: {
		color: '#ffffff',
	},
});

class Login extends React.Component {
	state = {
		twitterURL: '',
	};

	componentDidMount = () => {

	};
	handleClose = () => {
		this.props.onClose();
	};

	render() {
		const { classes } = this.props;
		return (
      <Dialog onClose={this.handleClose} aria-labelledby="login-dialog" open={this.props.open}>
				<DialogTitle id="login-dialog">連携するサービスを選んでください</DialogTitle>
				<div className={classes.div}>
					<List>
						<ListItem>
							<Button
								variant="raised"
								size="large"
								color="primary"
								href={process.env.REACT_APP_TWITTER_AUTH}
								className={classes.twitter}
							>twitter</Button>
						</ListItem>
					</List>
				</div>
			</Dialog>
		);
	}
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);

