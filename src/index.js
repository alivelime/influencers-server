import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import ReactGA from 'modules/classes/ReactGA';
import Callback from 'modules/containers/Login/Callback';
import HomePage from 'HomePage';
import User from 'User';
import Recommend from 'Recommend';
import Contact from 'Contact';
import Vision from 'Vision';
import Header from 'modules/containers/Header';
import Footer from 'modules/components/Footer';
import NotFound from 'NotFound';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';

import userReducer from 'modules/redux/user/reducers'
import userSaga from 'modules/redux/user/sagas';

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  userReducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(userSaga);

class App extends React.Component {
	render() {
		return (
			<Provider store={store} >
				<Router onUpdate={ReactGA.doPageTracking}>
					<div>
						<Header />
						<Switch>
							<Route exact path='/' component={HomePage} />
							<Route exact path='/login/callback/sns/:sns/token/:token/redirect/' component={Callback} />
							<Route exact path='/login/callback/sns/:sns/token/:token/redirect/:redirect' component={Callback} />
							<Route exact path='/users/:id' component={User} />
							<Route exact path='/users/:id/recommend-branches/:recommendBranchId' component={User} />
							<Route exact path='/users/:id/iine/:iineId' component={User} />
							<Route exact path='/recommends/:id' component={Recommend} />
							<Route exact path='/recommends/:id/userId/:userId' component={Recommend} />
							<Route exact path='/vision' component={Vision} />
							<Route exact path='/contact' component={Contact} />
							<Route component={NotFound} />
						</Switch>
						<Footer />
					</div>
				</Router>
			</Provider>
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
