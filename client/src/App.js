import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Authorize from './components/Authorize/Authorize';

const App = () => {
  const userInfo = localStorage.getItem('userInfo');
  
  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Switch>
          <Route path="/" exact component={() => <Redirect to="/posts" />} />
          <Route path="/posts" exact component={Home} />
          <Route path="/login" exact component={() => (!userInfo ? <Authorize /> : <Redirect to="/posts" />)} />
          <Route path="/login/:info" exact component={() => (!userInfo ? <Authorize /> : <Redirect to="/posts" />)} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;