import React, { Component } from 'react';
import GrommetWorldMap from './GrommetWorldMap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Blog from './Dashboard/Dashboard';

// injectTapEventPlugin();

class MainScreen extends Component {
    render() {
        return (
            <Blog/>
        );
    }
}

export default MainScreen;