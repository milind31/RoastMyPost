import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";
import Home from './components/home';
import NewUserForm from './components/new-user-form';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignIn from './components/signin-page';
import CreatePost from './components/create-post';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ed6c09',
      main: '#ed6c09',
      dark: '#ed6c09',
      contrastText: '#000',
    },
    secondary: {
      light: '#f5f5f5',
      main: '#f5f5f5',
      dark: '#f5f5f5',
      contrastText: '#fff',
    },
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
          </Switch>
        </div>
      </Router>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
