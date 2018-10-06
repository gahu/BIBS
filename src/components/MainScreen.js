import React, { Component } from 'react';
import GrommetWorldMap from './GrommetWorldMap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Dashboard from './Dashboard/Dashboard';

// injectTapEventPlugin();

class MainScreen extends Component {
    render() {
        return (
            <Dashboard/>
        );
    }
}

export default MainScreen;