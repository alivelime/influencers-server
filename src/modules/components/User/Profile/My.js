import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';


const styleSheet = theme => ({
});

class MyProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.initState(this.props);
		this.props.loadAffiliate();
	}
	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.setState(this.initState(this.props));
		}
	}
	componentWillUnmount() {
		this.props.clearAffiliate();
	}

	initState = props => ({
		changed: {
			memo: false,
			link: false,
			amazonjp: false,
			hherbjp: false,
	  },
		memo: props.user.memo,
		link: props.user.link,
		amazonjp: props.user.affiliate.amazonjp || '',
		iherbjp: props.user.affiliate.iherbjp || '',
	});

	handleChange = name => event => {
		this.setState({
			changed: {...this.state.changed, [name]: true},
			[name]: event.target.value,
		});
	}
	handleBlur = (name, f) => () => {
		if (this.state.changed[name]) {
			f({[name]: this.state[name]});
			this.setState({
				changed: {...this.state.changed, [name]: false},
			});
		}
	}

	render() {
		return (
			<Paper>
				<List component='nav'>
					<ListItem>
						<TextField
							fullWidth
							placeholder="説明を入れてください"
							value={this.state.memo}
							onChange={this.handleChange('memo')}
							onBlur={this.handleBlur('memo', this.props.updateUser)}
						/>
					</ListItem>
					<ListItem>
						<TextField
							fullWidth
							placeholder="ホームページのURL"
							value={this.state.link}
							onChange={this.handleChange('link')}
							onBlur={this.handleBlur('link', this.props.updateUser)}
						/>
					</ListItem>
					<ListItem>
						<Paper>
							<Typography variant="headline">アフィリタグ</Typography>
							<TextField
								fullWidth
								placeholder="Amazon.jp"
								value={this.state.amazonjp}
								onChange={this.handleChange('amazonjp')}
								onBlur={this.handleBlur('amazonjp', this.props.updateAffiliate)}
							/>
							<TextField
								fullWidth
								placeholder="iHerb.jp"
								value={this.state.iherbjp}
								onChange={this.handleChange('iherbjp')}
								onBlur={this.handleBlur('iherbjp', this.props.updateAffiliate)}
							/>
						</Paper>
					</ListItem>
				</List>
			</Paper>
		);
	}

}

MyProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(MyProfile);

