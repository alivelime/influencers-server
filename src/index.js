import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from 'HomePage';
import MyProfile from 'my/Profile';
import MyAdmin from 'my/Admin';
import User from 'User';
import Recommend from 'Recommend';
import Review from 'Review';
import About from 'About';
import Contact from 'Contact';
import Header from 'modules/components/Header';
import Footer from 'modules/components/Footer';
import NotFound from 'NotFound';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';


class App extends React.Component {
	render() {
		return (
			<Router>
				<div>
					<Header />
					<Switch>
						<Route exact path='/' component={HomePage} />
						<Route exact path='/my/profile' component={MyProfile} />
						<Route exact path='/my/admin' component={MyAdmin} />
						<Route exact path='/users/:id' component={User} />
						<Route exact path='/recommends/:id' component={Recommend} />
						<Route exact path='/reviews/:id' component={Review} />
						<Route exact path='/vision' component={About} />
						<Route exact path='/contact' component={Contact} />
						<Route component={NotFound} />
					</Switch>
					<Footer />
				</div>
			</Router>
		);
	}
}

const theme = createMuiTheme({
	palette: {
		primary: indigo,
		secondary: blue,
	 },
});

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<App />
	</MuiThemeProvider>
	,document.getElementById('root')
);
