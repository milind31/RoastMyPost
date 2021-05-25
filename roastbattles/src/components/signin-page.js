//React
import React, { Component } from 'react';
import { withRouter } from 'react-router';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Redux
import { userCreatedPost } from './actions/index';
import { connect } from 'react-redux';


class SignIn extends Component {
    constructor(){
        super()
        
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
          .then((result) => {
            var user = result.user;
            if (result.additionalUserInfo.isNewUser) {
              //register user in firestore
              firebase.firestore().collection("users").doc(user.uid.toString()).set({
                username: user.displayName,
                banned: false,
                likes : 0,
                createdPost: false,
                email: user.email
              })
              .then(() => {window.location = '/'})
              .catch(() => {console.log("document not added (error)")})
            }
            else {
                firebase.firestore().collection('users').doc(user.uid).get()
                  .then((docData) => {
                    if (docData.data().createdPost === true){
                      this.props.userCreatedPost();
                    }
                  })
                  this.props.history.push('/');
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
const mapStateToProps = (state) => ({

})

const mapActionsToProps = {
  userCreatedPost
}

export default connect(mapStateToProps, mapActionsToProps)(withRouter(SignIn));
