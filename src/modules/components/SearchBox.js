import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import IconSearch from '@material-ui/icons/Search';

const styleSheet = theme => ({
	icon: {
		width: '1.6em',
		height: '1.6em',
		color: theme.palette.secondary.main,
	},
	searchBox: {
		display: 'flex',
		width: '100%',
		padding: theme.spacing.unit * 2,
	},
	search: {
		flex: 1,
	},
});

class SearchBox extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.searchBox}>
				<IconButton>
					<IconSearch className={classes.icon} />
				</IconButton>
				<TextField
					type="search"
					placeholder="カテゴリ・アイテムを検索"
					fullWidth
					value={this.props.searchWord}
					onChange={this.props.handleChange || Function.prototype}
					className={classes.search}
				/>
			</Paper>
		);
	}
}

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(SearchBox);
