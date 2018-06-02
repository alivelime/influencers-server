import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddFolderIcon from '@material-ui/icons/CreateNewFolder';
import OpenFolderIcon from '@material-ui/icons/FolderOpen';
import CreateIcon from '@material-ui/icons/ThumbUp';
import DragIcon from '@material-ui/icons/SwapVert';

import { postAPI, deleteAPI } from 'modules/utils/DevUtils';

const styleSheet = theme => ({
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	color: {
		color: theme.palette.secondary[100],
	},
});

class RecommendBranch extends React.Component {
	state = this.props.data;

	addRecommendBranch = event => {
	}
	handleChange = event => {
		this.setState({
			name: event.target.value,
		});
	};
	handleSubmit = event => {
		event.preventDefault();
		postAPI(`/api/recommend-branches/${this.state.id}`, this.state, null);
	};

	deleteRecommendBranch = event => {
		deleteAPI(`/api/recommend-branches/${this.state.id}`);
	};

	render() {
		const { classes } = this.props;

		return (
			<ListItem>
				<IconButton aria-label='add folder' >
					<DragIcon color="secondary" className={classes.icon} />
				</IconButton>
				<TextField
					id={this.state.id}
					placeholder="カテゴリ名"
					fullWidth
					value={this.state.name}
					onChange={this.handleChange}
					onBlur={this.handleSubmit}
				/>
				<ListItemSecondaryAction>
					<IconButton aria-label='カテゴリを追加' >
						<AddFolderIcon className={classNames(classes.icon, classes.color)} />
					</IconButton>
					<IconButton aria-label='i子カテゴリを追加' >
						<OpenFolderIcon className={classNames(classes.icon, classes.color)} />
					</IconButton>
					<IconButton aria-label='「いいよ」を作成' >
						<CreateIcon color="secondary" className={classes.icon} />
					</IconButton>
					<IconButton aria-label='削除'>
						<DeleteIcon onClick={this.deleteRecommendBranch} color="error" className={classes.icon} />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		);
	}
}

RecommendBranch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranch);

