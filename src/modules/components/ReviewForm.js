import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';

import { postAPI } from 'modules/utils/DevUtils';
import { isAmazonJP, makeAmazonJPSimple } from 'modules/utils/AmazonURL';
import { getOGPData } from 'modules/utils/OGP';

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
		minWidth: '8vw',
	},
	image: {
		width: 160,
	},
	card: {
		display: 'flex',
	},
	content: {
	},
});

class ReviewForm extends React.Component {
	state = {
		kind: 'mono',
		url: '',
		urlError: false,
		urlHelper: '',
		evidence: '',
		urlTitle: '',
		urlImage: '',
		urlDescription: '',
		evidenceError: '',
		memo: '',
		forMe: 1,
		forYou: 1,
		date: (new Date()).getFullYear() + '-'
				+ ("0"+((new Date()).getMonth()+1)).slice(-2) + '-'
				+ ("0"+(new Date()).getDate()).slice(-2),
	};

	handleSubmit = async event => {
		event.preventDefault();
		if (this.isInvalid()) {
			return;
		}
		
		try {
			const { title } = getOGPData(this.state.url);
			await postAPI(`/api/recommends`, {
				URL: this.state.url,
				name: title,
				kind: this.state.kind,
			});
			const res = await postAPI(`/api/reviews`, {
				userId: this.props.userId,
				recommendBranchId: this.props.recommendBranch.Id,
				recommendId: this.state.url,
				iineId: this.props.iineId,
				evidence: this.state.evidence,
				memo: this.state.memo,
				forMe: this.state.forMe,
				forYou: this.state.forYou,
			});

			if (Object.keys(res).length === 0) {
				this.setState({urlError: true, urlHelper: '登録に失敗しました'});
			} else {
				this.props.submitCallback(true);
			}
			return;
		} catch (err) {
			console.log(err);
		}
	};
	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};
	validationURL = (value) => {
		if (/^https?:\/\//.test(value)) {
			return '';
		} else {
			return 'URLを入力してください(必須)';
		}
	};
	handleChangeURL = event => {
		const value = event.target.value;
		let url = value;
		let urlError = false;
		let urlHelper = '', ogp;
		const error = this.validationURL(value);
		if (error.length > 0) {
			urlError = true;
			urlHelper = error;
		} else {
			urlError = false;
			if (isAmazonJP(value)) {
				url = makeAmazonJPSimple(value);
				urlHelper = "AmazonURLです。アフィリタグは自動的に挿入されます。";
				ogp = getOGPData(value);
			}
		}
		this.setState({
			url: url,
			urlError: urlError,
			urlHelper: urlHelper,
			urlTitle: ogp.title,
			urlImage: ogp.image,
			urlDescription: ogp.description,
		});
	};
	validationEvidence = (value) => {
		if (value.length === 0 || /^https?:\/\//.test(value)) {
			return '';
		} else {
			return 'URLを入力してください';
		}
	}
	handleChangeEvidence = event => {
		const value = event.target.value;
		this.setState({evidence: value, evidenceError: this.validationEvidence(value)});
	};
	isInvalid = () => {
		return (this.state.url.length === 0 || this.state.urlError || this.state.evidenceErrorr);
	};
	clear(target) {
		return event => {
			this.setState({ [target]: ''});
		};
	};

	render() {
		const { classes, recommendBranch } = this.props;

		return (
			<Paper>
				<Typography className={classes.title} variant="headline">これいいよ!</Typography>
				<List component='nav'>
					<ListItem>
						<ListItemText primary={`親リスト: ${recommendBranch.name}`} />
					</ListItem>
					<ListItem>
						{(() => {
							if (this.props.kind === undefined) {
								return (
									<Select
										id="kind"
										value={this.state.kind}
										onChange={this.handleChange}
										fullWidth
										inputProps={{name:"kind"}}
									>
										<MenuItem value="mono">モノ</MenuItem>
										<MenuItem value="service">サービス</MenuItem>
										<MenuItem value="information">情報</MenuItem>
									</Select>
								);
							} else {
								return (
									<ListItemText primary={(this.props.kind === "mono" ? "モノ" :
																			 (this.props.kind === "service" ? "サービス" : "情報"))}
									/>
								);
							}
						})()}
					</ListItem>
					{(() => {
						if (this.props.url === undefined) {
							return (
								<ListItem>
									<TextField
										id="url"
										placeholder="オススメしたいもの(URL)"
										fullWidth
										value={this.state.url}
										onChange={this.handleChangeURL}
										helperText={this.state.urlHelper}
										error={(this.state.urlError)}
									/>
									<ListItemSecondaryAction>
										<IconButton aria-label='Delete' onClick={this.clear('url')}>
											<BackspaceIcon className={classes.icon} />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
						} else {
							return (
								<ListItem>
									<ListItemText primary={this.props.url} />
								</ListItem>
							);
						}
					})()}
					{(() => {
						if (this.state.urlTitle) {
							return (
								<Card className={classes.card}>
									<CardMedia
										className={classes.image}
										image={this.state.urlImage}
										title={this.state.urlTitle}
									/>
									<CardContent className={classes.content}>
										<Typography variant="title">{this.state.urlTitle}</Typography>
										<Typography variant="body1">{this.state.urlDescription}</Typography>
									</CardContent>
								</Card>
							);
						}
					})()}
					<ListItem>
						<TextField
							id="evidence"
							placeholder="感想URL(あなたのブログや動画のURL)"
							fullWidth
							value={this.state.evidence}
							onChange={this.handleChangeEvidence}
							helperText={this.state.evidenceError}
							error={(this.state.evidenceError.length > 0)}
						/>
						<ListItemSecondaryAction>
							<IconButton aria-label='Delete' onClick={this.clear('evidence')}>
								<BackspaceIcon className={classes.icon} />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<TextField
							id="memo"
							name="memo"
							placeholder="ひとこと"
							fullWidth
							value={this.state.memo}
							onChange={this.handleChange}
						/>
						<ListItemSecondaryAction>
							<IconButton aria-label='Delete' onClick={this.clear('memo')}>
								<BackspaceIcon className={classes.icon} />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<Grid container>
							<Grid item xs={12} sm={3}> 
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor='forMe'>お気に入り度</InputLabel>
									<Select
										id="forMe"
										value={this.state.forMe}
										onChange={this.handleChange}
										inputProps={{name:"forMe"}}
									>
										<MenuItem value={1}>1</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={5}>5</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={3}> 
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor='forYou'>オススメ度</InputLabel>
									<Select
										id="forYou"
										value={this.state.forYou}
										onChange={this.handleChange}
										inputProps={{name:"forYou"}}
									>
										<MenuItem value={1}>1</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={5}>5</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={3}> 
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
							<Grid item xs={12} sm={3}> 
								<Button
									onClick={this.handleSubmit}
									variant="raised"
									size="large"
									color="primary"
									disabled={this.isInvalid()}
								>登録</Button>
							</Grid>
						</Grid>
					</ListItem>
				</List>
			</Paper>
		);
	}
}

ReviewForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(ReviewForm);

