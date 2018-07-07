import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form'

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
import * as validation from 'modules/utils/validation.js';

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

	render() {
		const { classes } = this.props;

		return (
		<form >
			<Paper>
				<Typography className={classes.title} variant="headline">オススメ教えて!</Typography>
				<List component='nav'>
					<ListItem>
						<ListItemText primary={`親リスト: ${this.props.recommendBranchName}`} />
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
									<ListItemText primary={kindLabel[this.props.kind]} />
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
										onChange={this.props.handleURLChange}
										validate={[validation.errorIfEmpty, validation.errorIfNotURL]}
									/>
									<ListItemSecondaryAction>
										<IconButton aria-label='Delete' onClick={this.props.clearURL}>
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
					{this.props.recommendPreview && siteLabel(this.props.recommendPreview) && 
						<ListItem>
							<ListItemText primary={siteLabel(this.props.recommendPreview)} />
						</ListItem>
					}
					{this.props.recommendPreview && 
						<ListItem>
							<Recommend data={this.props.recommendPreview} />
						</ListItem>
					}
					<ListItem>
						<Field
							component={TextField}
							name="evidence"
							placeholder="感想URL(あなたのブログや動画のURL)"
							fullWidth
							validate={[validation.errorIfNotURL]}
						/>
						<ListItemSecondaryAction>
							<IconButton aria-label='Delete' onClick={this.props.clearEvidence} >
								<BackspaceIcon className={classes.icon} />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
					{this.props.evidencePreview && siteLabel(this.props.evidencePreview) &&
						<ListItem>
							<ListItemText primary={siteLabel(this.props.evidencePreview)} />
						</ListItem>
					}
					{this.props.evidencePreview &&
						<ListItem>
							<Recommend data={this.props.evidencePreview} />
						</ListItem>
					}
					<ListItem>
						<Field
							component={TextField}
							name="memo"
							placeholder="ひとこと"
							fullWidth
							validate={[validation.errorIfNumber]}
						/>
						<ListItemSecondaryAction>
							<IconButton aria-label='Delete' onClick={this.props.clearMemo}>
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
										name="forMe"
									>
										<MenuItem value={5}>5</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={1}>1</MenuItem>
									</Field>
								</FormControl>
							</Grid>
							<Grid item xs={6} sm={3}> 
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor='forYou'>オススメ度</InputLabel>
									<Field
										component={Select}
										name="forYou"
									>
										<MenuItem value={5}>5</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={1}>1</MenuItem>
									</Field>
								</FormControl>
							</Grid>
							<Grid item xs={6} sm={3}> 
								<FormControl className={classes.formControl}>
								<Field
									component={TextField}
									name="date"
									type="date"
									label="日付"
								/>
								</FormControl>
							</Grid>
							<Grid item xs={6} sm={3}> 
								<Button
								 disabled={this.props.invalid || this.props.submitting || this.props.pristine}
									onClick={this.props.handleSubmit}
									variant="raised"
									size="large"
									color="primary"
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

export default withStyles(styleSheet)(ReviewForm);
