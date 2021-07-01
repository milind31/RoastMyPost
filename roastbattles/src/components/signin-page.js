//React
import React, { Component } from 'react';

//Material UI
import withStyles from '@material-ui/core/styles/withStyles';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Redux
import { userCreatedPost, userHasNoPost, setUID, setUsername } from './actions/index';
import { connect } from 'react-redux';

const styles = {
  container: {
      background: "#333131"
  },
  header: {
      position: 'fixed',
      top: '36%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
  }
}

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
                username: '',
                banned: false,
                likes : 0,
                createdPost: false,
                email: user.email
              })
              .then(() => {this.props.setUID(user.uid)})
              .then(() => {window.location = '/set-username'})
              .catch((err) => {console.log("document not added (error)", err)})
            }
            else {
                firebase.firestore().collection('users').doc(user.uid).get()
                  .then((docData) => {
                    this.props.setUID(user.uid);
                    this.props.setUsername(docData.data().username)
                    if (docData.data().createdPost === true){
                      this.props.userCreatedPost();
                    }
                    else{
                      this.props.userHasNoPost();
                    }
                  })
                  .then(() => {window.location= '/';})
            }
          })
      }

      render () {
        const { classes } = this.props;
        return (
            <div className={classes.header}>
              <img style={{width:'15%', height:'15%'}} src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogo.png?alt=media&token=90d7f233-e25c-48c0-968a-e9cfa4597a6f" alt="logo"></img>
              <h1 style={{fontSize:'350%'}}>Welcome to RoastMyPost!</h1>
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
  userCreatedPost,
  userHasNoPost,
  setUID,
  setUsername,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(SignIn));
