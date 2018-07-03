import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {
  Select,
  TextField,
} from 'redux-form-material-ui'

import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';

import Recommend from 'modules/components/Recommend';
import { postAPI } from 'modules/utils/Request';
import { isURL } from 'modules/utils/Validation';
import { getMetaData } from 'modules/utils/Meta';

const message = {
};
const kindLabel = {
	'mono': 'モノ',
	'service': 'サービス',
	'information': '情報',
};
const siteLabel = (preview) => {
	if (!preview || !preview.site) return null;

	switch(preview.site) {
		case "amazon": return "AmazonJapanです。アフィリタグは自動的に挿入されます。";
		case "iherb": return "iHerbへのリンクです。アフィリタグは自動的に挿入されます。";
		case "niconico": return "ニコニコ動画のリンクです。生放送のリンクはデータ取得できません。";
		default:
	}
	return null;
}

const styleSheet = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
	},
	icon: {
		width: '1.6em',
		height: '1.6em',
	},
	title: {
		margin: theme.spacing.unit * 2,
	},
	formControl: {
		margin: theme.spacing.unit,
		width: '80%',
	},
	content: {
	},
});

class ReviewForm extends React.Component {
	handleSubmit = async event => {
	};
	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};
	validationURL = (value) => {
		if (isURL(value)) {
			return '';
		} else {
			return 'URLを入力してください(必須)';
		}
	};
	handleChangeURL = event => {
		const value = event.target.value;
		let url = value;
		let urlError = false;
		let urlHelper = '';
		const error = this.validationURL(value);
		if (error.length > 0) {
			urlError = true;
			urlHelper = error;
		} else {
			urlError = false;

			// get preview
			getMetaData(url).then((res) => this.setState({urlData: res, url: res.url, urlHelper: message[res.site]}));
		}

		// search all review. whether having same review or not.
		let recommendBranchId = this.state.recommendBranchId;
		if ((this.props.searchParent && recommendBranchId === "0") ||
				this.props.data.recommendBranchIsRecommend(recommendBranchId)
			) {
			const recommendBranchIds = this.props.data.searchRecommendBranchIds(url);
			if (recommendBranchIds.length > 0) {
				recommendBranchId = recommendBranchIds[0];
			} else {
				recommendBranchId = "0";
			}
		}

		this.setState({
			url: url,
			urlError: urlError,
			urlHelper: urlHelper,
			urlData: {},
			recommendBranchId: recommendBranchId,
		});
	};
	validationEvidence = (value) => {
		if (value.length === 0 || isURL(value)) {
			return '';
		} else {
			return 'URLを入力してください';
		}
	}
	handleChangeEvidence = event => {
		const value = event.target.value;
		getMetaData(value).then((res) => this.setState({evidenceData: res}));

		this.setState({
			evidence: value,
			evidenceError: this.validationEvidence(value),
			evidenceData: {},
		});
	};
	isInvalid = () => {
		return (this.state.url.length === 0 || this.state.urlError || this.state.evidenceErrorr);
	};
	clear(target) {
		return event => {
			this.setState({ [target]: ''});
		};
	};

	getParentRecommendBranchName = () => {
		const id = this.state.recommendBranchId;
		if (id === "0") return "トップ(自動選択)";

		const recommendBranch = this.props.data.getRecommendBranch(id);
		return !this.props.data.recommendBranchIsRecommend(id)
			? recommendBranch.name
			: (recommendBranch.parentId === "0"
					? `トップ(${id})`
					: this.props.data.getRecommendBranch(recommendBranch.parentId).name	
				);
	};

	render() {
		const { classes } = this.props;

		return (
		<form onSubmit={this.props.handleSubmit}
			<Paper>
				<Typography className={classes.title} variant="headline">オススメ教えて!</Typography>
				<List component='nav'>
					<ListItem>
						<ListItemText primary={`親リスト: ${this.getParentRecommendBranchName()}`} />
					</ListItem>
					<ListItem>
						{this.props.kind === undefined
							? (
									<Field  
										component={Select}
										name="kind"
										fullWidth
									>
										<MenuItem value="mono">モノ</MenuItem>
										<MenuItem value="service">サービス</MenuItem>
										<MenuItem value="information">情報</MenuItem>
									</Field>
								)
							: (
									<ListItemText primary={kindLable[this.props.kind]} />
								)
						}
					</ListItem>
					{this.props.url === undefined
						? (
								<ListItem>
									<Field
										component={TextField}
										name="url"
										placeholder="オススメしたいもの(URL)"
										fullWidth
									/>
									<ListItemSecondaryAction>
										<IconButton aria-label='Delete' onClick={this.clear('url')}>
											<BackspaceIcon className={classes.icon} />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							)
						: (
								<ListItem>
									<ListItemText primary={this.props.url} />
								</ListItem>
							)
					}
					<ListItem>
						<ListItemText primary={siteLabel(this.props.recommendPreview)} />
						<Recommend data={this.props.recommendPreview} />
					</ListItem>
					<ListItem>
						<Field
							component={TextField}
							name="evidence"
							placeholder="感想URL(あなたのブログや動画のURL)"
							fullWidth
						/>
						<ListItemSecondaryAction>
							<IconButton aria-label='Delete' onClick={this.clear('evidence')}>
								<BackspaceIcon className={classes.icon} />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemText primary={siteLabel(this.props.evidencePreview)} />
						<Recommend data={this.state.evidencePreview} />
					</ListItem>
					<ListItem>
						<Field
							component={TextField}
							name="memo"
							placeholder="ひとこと"
							fullWidth
						/>
						<ListItemSecondaryAction>
							<IconButton aria-label='Delete' onClick={this.clear('memo')}>
								<BackspaceIcon className={classes.icon} />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<Grid container wrap="nowrap">
							<Grid item xs={6} sm={3}> 
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor='forMe'>お気に入り度</InputLabel>
									<Field
										component={Select}
										id="forMe"
										value={this.state.forMe}
										onChange={this.handleChange}
										inputProps={{name:"forMe"}}
									>
										<MenuItem value={5}>5</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={1}>1</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6} sm={3}> 
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor='forYou'>オススメ度</InputLabel>
									<Select
										id="forYou"
										value={this.state.forYou}
										onChange={this.handleChange}
										inputProps={{name:"forYou"}}
									>
										<MenuItem value={5}>5</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={1}>1</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6} sm={3}> 
								<FormControl className={classes.formControl}>
								<TextField
									id="date"
									name="date"
									type="date"
									label="日付"
									value={this.state.date}
									onChange={this.handleChange}
								/>
								</FormControl>
							</Grid>
							<Grid item xs={6} sm={3}> 
								<Button
									onClick={this.props.handleSubmit}
									variant="raised"
									size="large"
									color="primary"
									disabled={this.isInvalid()}
								>{this.props.iineId ? 'これいいね!' : 'これいいよ!'}</Button>
							</Grid>
						</Grid>
					</ListItem>
				</List>
			</Paper>
		</form>
		);
	}
}

ReviewForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(reviewForm);
