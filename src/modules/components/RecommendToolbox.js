import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import AddFolderIcon from '@material-ui/icons/CreateNewFolder';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';
import DeleteIcon from '@material-ui/icons/Delete';

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
		this.props.checker.addRecommendHandler('RecommendToolbox', this.checkRecommend);
		this.props.checker.addRecommendBranchHandler('RecommendToolbox', this.checkRecommendBranch);
	}
	componentWillUnmount() {
		this.props.checker.removeRecommendHandler('RecommendToolbox');
		this.props.checker.removeRecommendBranchHandler('RecommendToolbox');
	}

	state = {
		recommendBranchCount: 0,
		recommendCount: 0,
	}

	addRecommendBranch = event => {
		if (this.state.recommendBranchCount === 1) {
			this.props.data.addRecommendBranch(this.props.checker.getRecommendBranchIds()[0]);
		}
	}
	addSubRecommendBranch = event => {
		if (this.state.recommendBranchCount === 1) {
			this.props.data.addSubRecommendBranch(this.props.checker.getRecommendBranchIds()[0]);
		}
	}
	deleteRecommendBranch = event => {
		this.props.data.deleteRecommendBranch(this.state.ids);
	};
	moveUpRecommendBranch = event => {
		if (this.state.recommendBranchCount === 1) {
			this.props.data.moveUpRecommendBranch(this.props.checker.getRecommendBranchIds()[0]);
		}
		if (this.state.recommendCount === 1) {
			this.props.data.moveUpRecommendBranch(this.props.checker.getRecommendIds()[0]);
		}
	};
	moveDownRecommendBranch = event => {
		if (this.state.recommendBranchCount === 1) {
			this.props.data.moveDownRecommendBranch(this.props.checker.getRecommendBranchIds()[0]);
		}
		if (this.state.recommendCount === 1) {
			this.props.data.moveDownRecommendBranch(this.props.checker.getRecommendIds()[0]);
		}
	};
	moveRecommendBranches = event => {
		if (this.state.recommendBranchCount >= 1 && (this.state.recommendBranchCount + this.state.recommendCount) >= 2) {
			console.log("move recommends");
			console.log(this.props.checker.getRecommendBranchIds());
			this.props.data.moveRecommendBranches(
				this.props.checker.getRecommendBranchIds(),
				this.props.checker.getRecommendIds()
			);
		}
		this.props.checker.uncheckAll();
	}

	checkRecommend = (url, id, value) => {
		this.setState({
			recommendCount: this.props.checker.getRecommendIds().length,
		});
	};
	checkRecommendBranch = (id, on) => {
		this.setState({
			recommendBranchCount: this.props.checker.getRecommendBranchIds().length,
		});
	};

	render() {
		const { classes } = this.props;

		return (
			<AppBar
				position="sticky"
				color="default"
			>
				<Toolbar>
					<Tooltip id="tooltip-top-start" title="上に移動">
						<IconButton>
							<ArrowUpwardIcon
								onClick={this.moveUpRecommendBranch}
								className={classNames(classes.icon, ((this.state.recommendBranchCount + this.state.recommendCount) === 1
											? classes.enable
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="下に移動">
						<IconButton>
							<ArrowDownwardIcon
								onClick={this.moveDownRecommendBranch}
								className={classNames(classes.icon, ((this.state.recommendBranchCount + this.state.recommendCount) === 1 
											? classes.enable 
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip
						id="tooltip-top-start"
						title="移動(移動したいリストをいくつか選択し、移動先を最後に選択してこのボタンを押します)"
					>
						<IconButton>
							<SwapHorizIcon
								onClick={this.moveRecommendBranches}
								className={((this.state.recommendBranchCount >= 1 &&
										(this.state.recommendBranchCount + this.state.recommendCount) >= 2)
											? classes.enable 
											: classes.disable)}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="リストを追加">
						<IconButton>
							<AddFolderIcon
								onClick={this.addRecommendBranch}
								className={classNames(classes.icon, ((this.state.recommendBranchCount + this.state.recommendCount) === 1 
											? classes.enable 
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="サブリストを追加">
						<IconButton>
							<SubdirectoryIcon
								onClick={this.addSubRecommendBranch}
								className={classNames(classes.icon, ((this.state.recommendBranchCount + this.state.recommendCount) === 1 
											? classes.enable 
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="削除(子要素は全て削除されます)">
						<IconButton>
							<DeleteIcon
								onClick={this.deleteAllRecommendBranch}
								className={classNames(classes.icon, ((this.state.recommendBranchCount + this.state.recommendCount) > 0 
											? classes.enableDelete 
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
		);
	}
}

RecommendToolbox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendToolbox);
