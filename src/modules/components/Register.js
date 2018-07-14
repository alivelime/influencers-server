import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';

const styleSheet = theme => ({
	root: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
		padding: theme.spacing.unit * 2,
	},
	image: {
		width: "320px",
	},
});

class Register extends React.Component {

	state={
		checked: false,
	};
	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root}>
				<Typography variant="headline">以下の内容で登録します</Typography>
				<div>
					<Table className={classes.table}>
						<TableBody>
							<TableRow>
								<TableCell>SNS</TableCell>
								<TableCell>{this.props.session.user.snsType}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>{this.props.session.user.snsId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>
									<a href={this.props.session.user.snsUrl} target="_blank">{this.props.session.user.name}</a>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Avatar</TableCell>
								<TableCell><Avatar src={this.props.session.user.avator} /></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Image</TableCell>
								<TableCell><img src={this.props.session.user.image} className={classes.image} alt="profile" /></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<div>
					<Checkbox
							checked={this.state.checked}
							onClick={() => {this.setState({checked: !this.state.checked})}}
					/>
					<a href="/terms" target="_blank">利用規約</a>に同意する。
				</div>
				<Button
					variant="contained"
					color="primary"
					onClick={this.props.register}
					disabled={!this.state.checked}
				>register</Button>
			</Paper>
		);
	}
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Register);

