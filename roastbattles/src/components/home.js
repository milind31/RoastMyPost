//React
import React, { Component } from 'react';
import NavWithNotifications from './navbar-with-notifications';
import NavLoggedOut from './navbar-loggedout';
//import { errorToast } from './utils/toast';

//Material UI
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

//Redux
import { connect } from 'react-redux';

const styles = {
    header: {
        position: 'fixed',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    button: {
        margin: "10px",
    },
    signOutButton: {
        position: "absolute",
        top: "20px",
        right: "20px"
    },

}

//homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {createdPost: false, uid: '', loading: true, userLoggedIn: true};

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.getNewPost = this.getNewPost.bind(this);
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            //user hasn't created username yet
            if (this.props.username === '') {
                window.location = '/set-username';
            }
            this.setState({uid: user.uid, loading: false})
        } else {
            //user is not logged in
            //window.location = '/signin';
            this.setState({userLoggedIn: false})
        }
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

    getNewPost(e) {
        e.preventDefault();

        //TEMPORARY FOR DEMONSTRATION PURPOSES
        window.location = '/posts/PGt9k7d0fxStT53oaZStEXrXDqZ2';

        /*var db = firebase.firestore();
        var posts = db.collection("posts");

        var key = posts.doc().id;

        console.log("key", key);
        if (this.state.userLoggedIn) {
            //try to get post above key
            posts.where(firebase.firestore.FieldPath.documentId(), '>=', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
            .then(snapshot => {
                if(snapshot.size > 0) {
                    snapshot.forEach(doc => {
                        window.location = '/posts/' + doc.id;
                    });
                }
                else {
                    //no post above key, get one below key
                    posts.where(firebase.firestore.FieldPath.documentId(), '<', key).where(firebase.firestore.FieldPath.documentId(), '!=', this.state.uid).limit(1).get()
                    .then(snapshot => {
                        if(snapshot.size > 0) {
                            snapshot.forEach(doc => {
                                window.location = '/posts/' + doc.id;
                            });
                        }
                        else {
                            errorToast("Couldn't find any posts!")
                        }
                    })
                    .catch(() => {
                        errorToast("There was an error! Please try again later")
                    });
                }
            })
            .catch(() => {
                errorToast("There was an error! Please try again later")
            });
        }
        else {
            //try to get post above key
            posts.where(firebase.firestore.FieldPath.documentId(), '>=', key).limit(1).get()
            .then(snapshot => {
                if(snapshot.size > 0) {
                    snapshot.forEach(doc => {
                        window.location = '/posts/' + doc.id;
                    });
                }
                else {
                    //no post above key, get one below key
                    posts.where(firebase.firestore.FieldPath.documentId(), '<', key).limit(1).get()
                    .then(snapshot => {
                        if(snapshot.size > 0) {
                            snapshot.forEach(doc => {
                                window.location = '/posts/' + doc.id;
                            });
                        }
                        else {
                            errorToast("Couldn't find any posts!")
                        }
                    })
                    .catch(() => {
                        errorToast("There was an error! Please try again later")
                    });
                }
            })
            .catch(() => {
                errorToast("There was an error! Please try again later")
            });
        } */
    }


    render () {
        const { classes } = this.props;

        return (
            <div>
                {this.state.userLoggedIn ? <NavWithNotifications/> : <NavLoggedOut/>}
                <div className={classes.header}>
                <h1>Welcome!</h1>
                {   this.state.userLoggedIn ? (
                    this.props.createdPost ? 
                    <Button 
                        onClick={() => window.location = `/posts/${this.state.uid}` } 
                        variant="outlined" color="secondary"
                        >View My Post
                    </Button> 
                    : 
                    <Button 
                        onClick={() => window.location = '/create-post' }
                        variant="outlined" color="secondary"
                        >Create My Post
                    </Button>
                    ):
                    <Button 
                        onClick={() => window.location = '/signin' }
                        variant="outlined" color="secondary"
                        >Sign In / Register
                    </Button>
                }
                    <Button 
                        onClick={this.getNewPost} 
                        className={classes.button} 
                        variant="outlined" 
                        color="primary"
                        >Find Random Post
                    </Button>
                </div>
            </div>
        )
  }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    createdPost: state.createdPost,
    username: state.username
})

export default connect((mapStateToProps),)(withStyles(styles)(Home));
