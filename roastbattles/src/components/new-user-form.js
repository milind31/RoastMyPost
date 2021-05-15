/*
import React, { Component } from 'react';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//homepage
export default class NewUserForm extends Component {
    componentDidMount () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get().then((docData) => {
                    if (docData.exists === true) {
                        if (docData.get("filledInfoForm")) {
                            window.location = '/home';
                        }
                    }
                })
            } else {
                window.location = '/';
            }
        });
    }
    render () {
        return (
            <div>
                <h1>This is the new user form</h1>
                <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
            </div>
        )
    }
  }
*/