import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Repo from './routes/Repo';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/repo/:user/:repo" component={Repo} />
    </Router>
  );
}

export default RouterConfig;
