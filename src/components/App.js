import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ListPage, PostPage, EditorPage, NotFoundPage } from 'pages';
import MainScreen from './MainScreen';
import Blog from './Blog/Blog';
import GrommetWorldMap from './GrommetWorldMap';

const App = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={MainScreen}/>
                <Route path="/blog/" component={Blog}/>
                <Route path="/maps/" component={GrommetWorldMap}/>
                <Route path="/page/" component={ListPage}/>
                <Route path="/page/:page" component={ListPage}/>
                <Route path="/tag/:tag/:page?" component={ListPage}/>
                <Route path="/post/:id" component={PostPage}/>
                <Route path="/editor" component={EditorPage}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </div>
    );
};

export default App;