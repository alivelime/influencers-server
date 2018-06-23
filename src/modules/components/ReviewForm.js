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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';

import Recommend from 'modules/components/Recommend';
import { postAPI } from 'modules/utils/Request';
import { isURL } from 'modules/utils/Validation';
import { getMetaData } from 'modules/utils/Meta';

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
	constructor(props) {
		super(props);

		this.state = this.initState();
		this.props.checker.addRecommendHandler('ReviewForm', this.checkRecommend);
		this.props.checker.addRecommendBranchHandler('ReviewForm', this.checkRecommendBranch);
	}
	initState() {

		// searchRecommendBranch(url)[0] > this.props.recommendBranchId > "0" ...
		let recommendBranchId = "0";
		if (this.props.url) {
			const recommendBranchIds = this.props.data.searchRecommendBranchIds(this.props.url);
			if (recommendBranchIds.length > 0) {
				recommendBranchId = recommendBranchIds[0];
			}
		} else {
			if (this.props.recommendBranchId) {
				recommendBranchId = this.props.recommendBranchId;
			}
		}

		return {
			kind: this.props.kind || 'mono',
			error: false,
			errorMessage: '',
			url: this.props.url || '',
			urlError: false,
			urlHelper: '',
			evidence: '',
			evidenceError: '',
			memo: '',
			forMe: 3,
			forYou: 3,
			date: (new Date()).getFullYear() + '-'
					+ ("0"+((new Date()).getMonth()+1)).slice(-2) + '-'
					+ ("0"+(new Date()).getDate()).slice(-2),
			recommendBranchId: recommendBranchId,
			urlData: {},
			evidenceData: {},
		};
	}

	componentWillUnmount() {
		this.props.checker.removeRecommendHandler('ReviewForm');
		this.props.checker.removeRecommendBranchHandler('ReviewForm');
	}

	checkRecommend = (id, url, value) => {
		if (value === true) {
			this.setState({
				recommendBranchId: id,
				url: url,
			});
		}
	};
	checkRecommendBranch = (id, value) => {
		if (value === true) {
			this.setState({
				recommendBranchId: id,
			});
		}
	};

	handleSubmit = async event => {
		event.preventDefault();
		if (this.isInvalid()) {
			return;
		}
		
		const recommend = {
			url: this.state.url,
			link: this.state.url,
			kind: this.state.kind,
			Description: "",
		};

		let res;
		try {
			postAPI(`/api/recommends`, recommend)
			.then((res) => {
				this.props.data.updateRecommend(res);
			});

			// if recommend branch does not have same review. add sub recommend branch.
			let addFlag = false;
			if (!this.props.data.recommendBranchIsRecommend(this.state.recommendBranchId, this.state.url)) {
				addFlag = true;
			}
			const recommendBranchId = (addFlag 
				 ? (await this.props.data.addSubRecommendBranch(this.state.recommendBranchId)).id
				 : this.state.recommendBranchId);

			res = await postAPI(`/api/reviews`, {
				userId: this.props.userId,
				recommendBranchId: recommendBranchId,
				recommendId: this.state.url,
				iineId: this.props.iineId,
				evidence: this.state.evidence,
				memo: String(this.state.memo),
				forMe: this.state.forMe,
				forYou: this.state.forYou,
			});

			if (Object.keys(res).length === 0) {
				this.setState({urlError: true, urlHelper: '登録に失敗しました'});
				if (addFlag) {
					this.props.data.deleteRecommendBranch([recommendBranchId]);
				}
				return;
			}

			if (this.state.evidence.length > 0) {
				const evidence = {
					url: this.state.evidence,
					kind: "information",
				};
				postAPI(`/api/recommends`, evidence)
				.then((r) => {
					this.props.data.updateEvidence(res, r);
				});
			}
		} catch (err) {
			console.log(err);
			return;
		}

		this.setState(this.initState());
		this.props.data.addReview(res, recommend);
		this.props.checker.uncheckAll();
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
			const message = {
				"amazon": "AmazonURLです。アフィリタグは自動的に挿入されます。",
				"iherb": "iHerbへのリンクです。アフィリタグは自動的に挿入されます。",
				"niconico": "ニコニコ動画のリンクです。生放送のリンクはデータ取得できません。",
				"general": "",
			};
			getMetaData(url).then((res) => this.setState({urlData: res, url: res.url, urlHelper: message[res.site]}));
		}

		// search all review. whether having same review or not.
		let recommendBranchId = this.state.recommendBranchId;
		if (this.props.searchParent) {
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
			<Paper>
				<Typography className={classes.title} variant="headline">オススメ教えて?</Typography>
				<List component='nav'>
					<ListItem>
						<ListItemText primary={`親リスト: ${this.getParentRecommendBranchName()}`} />
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
					<ListItem>
						<Recommend data={this.state.urlData} />
					</ListItem>
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
						<Recommend data={this.state.evidenceData} />
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
						<Grid container wrap="nowrap">
							<Grid item xs={6} sm={3}> 
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor='forMe'>お気に入り度</InputLabel>
									<Select
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
									onClick={this.handleSubmit}
									variant="raised"
									size="large"
									color="primary"
									disabled={this.isInvalid()}
								>これいいよ!</Button>
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

