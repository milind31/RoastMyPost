import React, { Component } from 'react';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";


export default class SignIn extends Component {
    constructor(){
        super()
        
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
          .then((result) => {
            if (result.additionalUserInfo.isNewUser) {
              var user = result.user;
              console.log(user.uid.toString());
              firebase.firestore().collection("users").doc(user.uid.toString()).set({
                username: user.displayName,
                banned: false,
                likes : 0,
                createdPost: false,
                email: user.email
              })
              .then(() => {window.location = '/'})
              .catch(() => {console.log("document not added (error)")})
              console.log("end of sign in function reached");
            }
            else {
                window.location = '/'
            }
          })
      }

      render () {
        return (
            <div>
              <img style={{width:'15%', height:'15%'}} src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogo.png?alt=media&token=90d7f233-e25c-48c0-968a-e9cfa4597a6f"></img>
               <h1>Welcome to RoastMyPost!</h1>
                <p>The best place to take your day out on a stranger!</p>
                <button onClick={this.signInWithGoogle} type="button" class="login-with-google-btn" >
                    Sign in with Google
                </button>
            </div>
            )
     }
    
}
