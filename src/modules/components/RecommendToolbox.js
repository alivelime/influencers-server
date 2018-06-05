import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddFolderIcon from '@material-ui/icons/CreateNewFolder';
import OpenFolderIcon from '@material-ui/icons/FolderOpen';
import CreateIcon from '@material-ui/icons/ThumbUp';
import DragIcon from '@material-ui/icons/SwapVert';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';

const styleSheet = theme => ({
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	disable: {
		color: theme.palette.grey[300],
	},
	enable: {
		color: theme.palette.secondary.main,
	},
	enableIiyo: {
		color: theme.palette.secondary.main,
	},
	enableDelete: {
		color: theme.palette.error.main,
	},
});

class RecommendToolbox extends React.Component {

	constructor(props) {
		super(props);
		this.props.setHandleCheck(this.handleCheck);
	}

	state = {
		ids: [],
	}

	addRecommendBranch = event => {
		if (this.state.ids.length === 1) {
			this.props.addRecommendBranch(this.state.ids[0]);
		}
	}
	deleteRecommendBranch = event => {
		this.props.deleteRecommendBranch(this.state.ids);
	};
	swapRecommendBranch = event => {
		this.props.swapRecommendBranch(this.state.ids[0]);
	};

	handleCheck = (id) => {
		let ids = this.state.ids;

		if (id) {
			ids.push(id);
		} else {
			ids.splice(ids.indexOf(id), 1);
		}
		this.setState({ids: ids});
	};

	render() {
		const { classes } = this.props;

		return (
			<AppBar
				position="sticky"
				color="default"
			>
				<Toolbar>
					<Typography variant="headline">リスト</Typography>
					<IconButton aria-label='下に移動' >
						<DragIcon
							onClick={this.swapRecommendBranch}
							className={classNames(classes.icon, (this.state.ids.length === 1 ? classes.enable : classes.disable))}
						/>
					</IconButton>
					<IconButton aria-label='次のリストに移動' >
						<SubdirectoryIcon
							className={classNames(classes.icon, (this.state.ids.length === 1 ? classes.enable : classes.disable))}
						/>
					</IconButton>
					<IconButton aria-label='カテゴリを追加' >
						<AddFolderIcon
							onClick={this.addRecommendBranch}
							className={classNames(classes.icon, (this.state.ids.length === 1 ? classes.enable : classes.disable))}
						/>
					</IconButton>
					<IconButton aria-label='子カテゴリを追加' >
						<OpenFolderIcon
							className={classNames(classes.icon, (this.state.ids.length === 1 ? classes.enable : classes.disable))}
						/>
					</IconButton>
					<IconButton aria-label='「いいよ」を作成' >
						<CreateIcon
							className={classNames(classes.icon, (this.state.ids.length === 1 ? classes.enableIiyo : classes.disable))}
						/>
					</IconButton>
					<IconButton aria-label='削除'>
						<DeleteIcon
							onClick={this.deleteRecommendBranch}
							className={classNames(classes.icon, (this.state.ids.length > 0 ? classes.enableDelete : classes.disable))}
						/>
					</IconButton>
				</Toolbar>
			</AppBar>
		);
	}
}

RecommendToolbox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendToolbox);
