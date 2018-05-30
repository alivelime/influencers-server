import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddFolderIcon from '@material-ui/icons/CreateNewFolder';
import OpenFolderIcon from '@material-ui/icons/FolderOpen';
import CreateIcon from '@material-ui/icons/Create';


const styleSheet = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
	},
});

class RecommendTree extends React.Component {
	state = {
		newBranch: '',
	};
	handleChange = () => event => {
		this.setState({
			newBranch: event.target.value,
		});
	}
	handleSubmit = () => event => {
		event.preventDefault();
		this.setState({
			newBranch: '',
		});
	}
	render() {
		const { classes } = this.props;

		return (
				<div className={classes.root}>
					<div className={classes.content}>
						<Typography variant="headline">リスト</Typography>
					</div>
					<List component='nav'>
						<ListItem>
							<TextField
								id="branch"
								placeholder="新しいリスト名"
								fullWidth
								value={this.state.newBranch}
								onChange={this.handleChange()}
							/>
							<ListItemSecondaryAction>
								<IconButton aria-label='add folder' >
									<AddFolderIcon className={classes.icon} />
								</IconButton>
								<IconButton aria-label='add folder' >
									<OpenFolderIcon className={classes.icon} />
								</IconButton>
								<IconButton aria-label='add folder' >
									<CreateIcon className={classes.icon} />
								</IconButton>
								<IconButton aria-label='Delete'>
									<DeleteIcon className={classes.icon} />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					</List>
				</div>
		);
	}
}

RecommendTree.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendTree);
