import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import BackspaceIcon from '@material-ui/icons/Backspace';

const styleSheet = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: '8vw',
	},
});

class ReviewForm extends React.Component {
	state = {
		kind: 'mono',
		url: '',
		evidence: '',
		importance: 1,
		familiarity: 1,
		date: (new Date()).getFullYear() + '-'
				+ ("0"+((new Date()).getMonth()+1)).slice(-2) + '-'
				+ ("0"+(new Date()).getDate()).slice(-2),
	};

	handleSubmit = event => {
		event.preventDefault();
	};
	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};
	clear = event => {
		this.setState({ [event.target.name]: '' });
	};

	render() {
		const { classes, branch } = this.props;

		return (
			<Paper>
				<Typography variant="headline">これいいよ!</Typography>
				<form onSubmit={this.handleSubmit}>
					<List component='nav'>
						<ListItem>
							<ListItemText primary={branch} />
						</ListItem>
						<ListItem>
							<Select
								value={this.state.kind}
								onChange={this.state.handleChange}
								fullWidth
								input={<Input name="name" id="kind" />}
							>
								<MenuItem value="mono">モノ</MenuItem>
								<MenuItem value="service">サービス</MenuItem>
								<MenuItem value="information">情報</MenuItem>
							</Select>
						</ListItem>
						<ListItem>
							<TextField
								id="url"
								placeholder="オススメしたいもの(URL)"
								fullWidth
								value={this.state.url}
								onChange={this.handleChange}
							/>
							<ListItemSecondaryAction>
								<IconButton aria-label='Delete' onClick={this.clear}>
									<BackspaceIcon className={classes.icon} />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem>
							<TextField
								id="evidence"
								placeholder="感想URL(あなたのブログや動画のURL)"
								fullWidth
								value={this.state.evidence}
								onChange={this.handleChange}
							/>
							<ListItemSecondaryAction>
								<IconButton aria-label='Delete' onClick={this.clear}>
									<BackspaceIcon className={classes.icon} />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem>
							<TextField
								id="memo"
								placeholder="ひとこと"
								fullWidth
								value={this.state.memo}
								onChange={this.handleChange}
							/>
							<ListItemSecondaryAction>
								<IconButton aria-label='Delete' onClick={this.clear}>
									<BackspaceIcon className={classes.icon} />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
						<ListItem>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor='importance'>オススメ度</InputLabel>
								<Select
									value={this.state.importance}
									onChange={this.handleChange}
									input={<Input name="name" id="importance" />}
								>
									<MenuItem value={1}>1</MenuItem>
									<MenuItem value={2}>2</MenuItem>
									<MenuItem value={3}>3</MenuItem>
									<MenuItem value={4}>4</MenuItem>
									<MenuItem value={5}>5</MenuItem>
								</Select>
							</FormControl>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor='familiarity'>親近感</InputLabel>
								<Select
									value={this.state.familiarity}
									onChange={this.state.handleChange}
									input={<Input name="name" id="familiarity" />}
								>
									<MenuItem value={1}>1(親しみやすい・普段使い)</MenuItem>
									<MenuItem value={2}>2</MenuItem>
									<MenuItem value={3}>3</MenuItem>
									<MenuItem value={4}>4</MenuItem>
									<MenuItem value={5}>5(とっつきにくい・特別)</MenuItem>
								</Select>
							</FormControl>
							<FormControl className={classes.formControl}>
							<TextField
								id="memo"
								type="date"
								label="日付"
								value={this.state.date}
								onChange={this.handleChange}
							/>
							</FormControl>
						</ListItem>
					</List>
				</form>
			</Paper>
		);
	}
}

ReviewForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(ReviewForm);

