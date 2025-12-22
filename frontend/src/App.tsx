import { Component } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App: Component = () => (
  <Router
    root={(props) => (
      <div class="min-h-screen bg-gray-50">
        <Header />
        <main>{props.children}</main>
      </div>
    )}
  >
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
  </Router>
);

export default App;
