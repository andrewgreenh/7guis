import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation from './Navigation';
import screens from './screens/screens';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Navigation screens={screens} />
        <Switch>
          {screens.map(({ path, component }) => (
            <Route key={path} path={path} exact component={component} />
          ))}
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
