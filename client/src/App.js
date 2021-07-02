import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Authorize from './components/Authorize/Authorize';

const App = () => {
  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Authorize} />
          <Route path="/login/:info" exact component={Authorize} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;