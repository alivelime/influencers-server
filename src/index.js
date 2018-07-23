import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import withTracker from 'modules/components/withTracker';
import Callback from 'modules/containers/Login/Callback';
import HomePage from 'HomePage';
import User from 'User';
import Recommend from 'Recommend';
import Terms from 'Terms';
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
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  userReducer,
	 composeEnhancers(
  applyMiddleware(sagaMiddleware)
));
sagaMiddleware.run(userSaga);

class App extends React.Component {
	render() {
		return (
			<Provider store={store} >
				<Router>
					<div>
						<Route path='/' component={Header} />
						<Switch>
							<Route exact path='/' component={withTracker(HomePage)} />
							<Route exact path='/login/callback/sns/:sns/token/:token/redirect/' component={withTracker(Callback)} />
							<Route exact path='/login/callback/sns/:sns/token/:token/redirect/:redirect' component={withTracker(Callback)} />
							<Route exact path='/users/:id' component={withTracker(User)} />
							<Route exact path='/users/:id/recommend-branches/:recommendBranchId' component={withTracker(User)} />
							<Route exact path='/users/:id/iine/:iineId' component={withTracker(User)} />
							<Route exact path='/recommends/:id' component={withTracker(Recommend)} />
							<Route exact path='/recommends/:id/userId/:userId' component={withTracker(Recommend)} />
							<Route exact path='/vision' component={withTracker(Vision)} />
							<Route exact path='/terms' component={withTracker(Terms)} />
							<Route component={withTracker(NotFound)} />
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
