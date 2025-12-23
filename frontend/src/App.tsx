import { Component } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import Therapists from "./pages/Therapists";

const App: Component = () => (
  <AuthProvider>
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
      <Route path="/blogs" component={Blogs} />
      <Route path="/therapists" component={Therapists} />
    </Router>
  </AuthProvider>
);

export default App;
