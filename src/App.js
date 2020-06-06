import React, { Component } from "react";
import TodoContainer from "./components/TodoContainer";
import AppNavbar from "./components/AppNavbar";
import {Provider} from 'react-redux';
import rootReducer from './reducers/index';
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import {BrowserRouter,Route} from 'react-router-dom';
import Login from './components/Login'
import Logout from './components/Logout'
import Signup from './components/Signup'
import Home from './components/Home'
const middleware = [thunk];
const initialState = {};
const store=createStore(rootReducer,
initialState,
compose(
  applyMiddleware(...middleware)
));
class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
        <BrowserRouter>
          <AppNavbar />
          <Route exact path="/"><Home/></Route>
          <Route path="/login"><Login/></Route>
          <Route path="/logout"><Logout/></Route>
          <Route path="/signup"><Signup/></Route>
          <Route path="/todo"><TodoContainer /></Route>
        </BrowserRouter>
        </Provider>
      </div>
    );
  }
}



export default App;
