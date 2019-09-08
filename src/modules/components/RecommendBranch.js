import React from 'react';
import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import Link from 'modules/components/Link';
import RecommendBranchName from 'modules/containers/RecommendBranchName';
import ReviewList from 'modules/containers/ReviewList';

library.add(faChevronLeft);
library.add(faChevronRight);

const styleSheet = theme => ({
	root: {
		padding:0,
	},
	container:{
		paddingLeft: '2em',
		padding:0,
	},
	list: {
		width: "100%",
		padding:0,
	},
	content: {
		padding:0,
		backgroundColor: 'inherit',
	},
	icon: {
		fontSize: '2em',
		color: theme.palette.secondary.main,
	},

	bread: {
		fontSize: "14px",
		letterSpacing: "-.4em",
	},
	breadLi: {
		margin: "0 5px 5px 0",
		background: "#ddd",
		color: theme.palette.secondary.main,
		lineHeight: "100%",
		letterSpacing: "normal", 
		display: "inline-block",
		transition: "0.3s ease-out",
		"&:first-child": {
			paddingLeft:"12px",
		},
		"&:last-child a": {
			padding: "8px 12px 8px 18px",
			color: "#fff",
			background: theme.palette.secondary.main,
		},
		"&:hover": {
			background: theme.palette.secondary.main,
		},
	},
	breadLiA: {
		padding:"8px 12px 8px 18px",
		color: theme.palette.secondary.main,
		display: "block",
		position:"relative",
		zIndex:1,
		transition: "0.3s ease-out",
		"&:before": {
			border: "14px solid transparent",
			borderLeft: "14px solid #fff",
			boxSizing: "border-box",
			content: "''",
			height: "28px",
			width: "14px",
			margin: "-14px 0 0 0",
			position: "absolute",
			top: "50%",
			left: "100%",
			zIndex:2,
		},
		"&:after": {
			border: "8px solid transparent",
			borderLeft: "8px solid #ddd",
			boxSizing: "border-box",
			content: "''",
			height: "16px",
			width: "8px",
			margin: "-8px 0 0 0",
			position: "absolute",
			top: "50%",
			left: "100%",
			zIndex:3,
			transition: "0.3s ease-out",
		},
		"&:hover": {
			color:"#fff",
		},
		"&:hover:after": {
			borderLeft: "8px solid #000",
		},
	},
});

class RecommendBranch extends React.Component {

	render() {
		console.log('render recommendbranch '+this.props.id);

		const { classes } = this.props;
		const ancestore = this.props.ancestore.map((a) => {
			return (
				<li className={classes.breadLi}>
					<Link to={`/users/${this.props.userId}/recommend-branches/${a.id}`} className={classes.breadLiA} >
						{a.name}
					</Link>
				</li>
			);
		});
		const children = this.props.childIds.map((id) => {
			return (
				<Paper className={classes.content}>
					<ListItem className={classes.root} >
						<FontAwesomeIcon icon="chevron-right" className={classes.icon} /> 
						<RecommendBranchName
							id={id}
							userId={this.props.userId}
						/>
					</ListItem>
					<ReviewList recommendBranchId={id} />
				</Paper>
			);
		});

		const ancestorePath = this.props.ancestore.map((a) => a.name).join(" -> ");
		const title = "インフルず　" + ancestorePath;
		const description = this.props.user.name + "さんのオススメまとめ　" + ancestorePath;

		return (
			<List component='nav' className={classes.list}>
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
					<meta name="og:image" content="http://www.tokishirazu.llc/img/influs.png" />
					<meta name="og:url" content={this.props.location} />
					<meta name="og:type" content="website" />
					<meta name="og:title" content={title}/>
					<meta name="og:description" content={description}/>
					<meta name="og:site_name" content="「これいいよ!」でつながるオススメまとめサイト インフルず(β)" />
					<meta name="twitter:card" content="summary" />
					<meta name="fragment" content="1" />
				</Helmet>
				<Paper>
					<ListItem className={classes.root}>
						<ul className={classes.bread}>{ancestore}</ul>
					</ListItem>
				</Paper>
				<Paper className={classes.content}>
					<ListItem className={classes.root}>
						{this.props.id !== "0" &&
							<div>
								<Link to={`/users/${this.props.userId}/recommend-branches/${this.props.parentId}`} >
									<FontAwesomeIcon icon="chevron-left" className={classes.icon} /> 
								</Link>
							</div>
						}
						{this.props.id !== "0" &&
							<RecommendBranchName
								id={this.props.id}
								userId={this.props.userId}
							/>
						}
					</ListItem>
				</Paper>
				{children}
				<ReviewList recommendBranchId={this.props.id} />
			</List>
		);
	}
}

RecommendBranch.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(RecommendBranch);

