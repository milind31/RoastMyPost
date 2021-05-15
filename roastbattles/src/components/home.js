import React, { Component } from 'react';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//homepage
export default class Home extends Component {
    componentDidMount () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                //user is
            } else {
                window.location = '/signin';
            }
        });
    }


    render () {
        return (
            <div>
                <h1>Welcome!</h1>
                <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
            </div>
        )
  }
}
  