import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./components/App";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import registerServiceWorker from "./registerServiceWorker";

import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
