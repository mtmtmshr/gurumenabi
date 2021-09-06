import {BrowserRouter as Router, Route} from "react-router-dom";
import React from 'react';
import Layout from "./components/Layout";
import Home from "./components/Home"
import './index.css'
import { Provider } from 'react-redux';
import store from './app/store';
import Result from "./components/Result";
import AllResults from "./components/AllResults";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout title="ぐるめなび">
            <Route exact path='/' component={Home}/>
            <Route exact path='/result' component={Result} />
            <Route exact path='/result/all' component={AllResults} />
        </Layout>
      </Router>
    </Provider>
  );
}

export default App
