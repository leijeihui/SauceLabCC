import React from 'react';
import { render } from 'react-dom';
import {BrowserRouter as Router, Route, Link, HashRouter} from 'react-router-dom';
import Landing from './components/Landing.jsx';

render(

  <HashRouter>
    <div>        
      <div className="logo">SauceLabs Coding Challenge</div>
      <hr />
      <Route exact path="/" component={() => {
        return <Landing />;
      }} />
    </div>
  </HashRouter>, 
  document.getElementById('app')
);

