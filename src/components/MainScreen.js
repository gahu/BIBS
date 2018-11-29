import React, { Component } from 'react';
import Dashboard from './Dashboard/Dashboard';
import { ListPage, PostPage, EditorPage, NotFoundPage } from 'pages';

class MainScreen extends Component {
    render() {
        return (
            <Dashboard/>
        );
    }
}

export default MainScreen;