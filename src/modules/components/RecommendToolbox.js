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
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

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
	enableDelete: {
		color: theme.palette.error.main,
	},
});

class RecommendToolbox extends React.Component {

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
								onClick={this.props.moveUpRecommendBranch || Function.prototype}
								className={classNames(classes.icon, ( this.props.moveUpRecommendBranch
											? classes.enable
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="下に移動">
						<IconButton>
							<ArrowDownwardIcon
								onClick={this.props.moveDownRecommendBranch || Function.prototype}
								className={classNames(classes.icon, ( this.props.moveDownRecommendBranch 
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
								onClick={this.props.moveRecommendBranches || Function.prototype}
								className={classNames(classes.icon, (this.props.moveRecommendBranches
											? classes.enable 
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="リストを追加">
						<IconButton>
							<AddFolderIcon
								onClick={this.props.addRecommendBranch || Function.prototype}
								className={classNames(classes.icon, (this.props.addRecommendBranch
											? classes.enable 
											: classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="サブリストを追加">
						<IconButton>
							<SubdirectoryIcon
								onClick={this.props.addSubRecommendBranch || Function.prototype}
								className={classNames(classes.icon, (this.props.addSubRecommendBranch ? classes.enable : classes.disable))}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="削除(仕様考え中)">
						<IconButton>
							<DeleteIcon
								onClick={Function.prototype}
								className={classNames(classes.icon, classes.disable)}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="全て開く">
						<IconButton>
							<ExpandMore
								onClick={this.props.openAll}
								className={classNames(classes.icon, classes.enable)}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip id="tooltip-top-start" title="全て閉じる">
						<IconButton>
							<ExpandLess
								onClick={this.props.closeAll}
								className={classNames(classes.icon, classes.enable)}
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
