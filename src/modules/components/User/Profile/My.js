import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';


const styleSheet = theme => ({
});

class MyProfile extends React.Component {

	state = {
		memoChanged: false,
		memo: this.props.data.memo,
		linkChanged: false,
		link: this.props.data.link,
	};

	handleMemoChange = event => {
		this.setState({
			memoChanged: true,
			memo: event.target.value,
		});
	}
	handleMemoBlur = () => {
		if (this.state.memoChanged) {
			this.props.updateUser({memo: this.state.memo});
			this.setState({memoChanged: false});
		}
	}

	handleLinkChange = event => {
		this.setState({
			linkChanged: true,
			link: event.target.value,
		});
	}
	handleLinkBlur = () => {
		if (this.state.linkChanged) {
			this.props.updateUser({link: this.state.link});
			this.setState({linkChanged: false});
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
							onChange={this.handleMemoChange}
							onBlur={this.handleMemoBlur}
						/>
					</ListItem>
					<ListItem>
						<TextField
							fullWidth
							placeholder="ホームページのURL"
							value={this.state.link}
							onChange={this.handleLinkChange}
							onBlur={this.handleLinkBlur}
						/>
					</ListItem>
					<ListItem>
						<div>
							<button
								variant="contained"
								color="error"
								onClick={this.props.deleteUser}
							>アカウント削除</button>
						</div>
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

