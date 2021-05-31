//React
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './components/home';
import ViewPost from './components/view-post';
import SignIn from './components/signin-page';
import CreatePost from './components/create-post';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Material UI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import EditPost from './components/edit-post';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f0c322',
      main: '#ed6c09',
      dark: '#e06100',
      contrastText: '#000',
    },
    secondary: {
      light: '#f5f5f5',
      main: '#f5f5f5',
      dark: '#f5f5f5',
      contrastText: '#fff',
    }
  },
});

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDJnrf-OqutEb9BLXT-q34BDREFTpuBw3M",
    authDomain: "roastbattles-85b35.firebaseapp.com",
    projectId: "roastbattles-85b35",
    storageBucket: "roastbattles-85b35.appspot.com",
    messagingSenderId: "831370750345",
    appId: "1:831370750345:web:0b62cc194dea462cca5958",
    measurementId: "G-V8QZJXP8E7"
  });
}
else {
  firebase.app(); // if already initialized, use that one
}

//routes
class App extends Component {
  render () {
    return (
      <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
        <div className="container">
          <Switch>
            <Route exact path="/signin" render={() => <SignIn/>}/>
            <Route exact path="/" render={() => <Home/>}/>
            <Route exact path="/create-post" render={() => <CreatePost/>}/>
            <Route exact path={"/posts/:id"}  component={ViewPost}/>
            <Route exact path={"/posts/:id/edit"}  component={EditPost}/>
          </Switch>
        </div>
      </Router>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
