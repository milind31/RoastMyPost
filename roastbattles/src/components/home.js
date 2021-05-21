import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

const styles = {
    button: {
        margin: "10px",
    },
    signOutButton: {
        position: "absolute",
        top: "20px",
        right: "20px"
    }
}

//homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {createdPost: false, userID: ''};

        this.handleAuthChange = this.handleAuthChange.bind(this);

    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user is logged in
            firebase.firestore().collection('users').doc(user.uid).get()
            .then((docData) => {
                this.setState({createdPost: docData.data().createdPost, userID: user.uid})
            })
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }


    render () {
        const { classes } = this.props;
        return (
            <div>
                <h1>Welcome!</h1>
                {this.state.createdPost ? <Button  onClick={() => window.location = `/posts/${this.state.userID}` } variant="outlined" color="secondary">View My Post</Button> : <Button onClick={() => window.location = '/create-post' }variant="outlined" color="secondary">Create My Post</Button>}
                <Button onClick={() => window.location = '/posts/' /*TODO: ADD POST ID THROUGH PROPS*/ } className={classes.button} variant="outlined" color="primary">Find Random Post</Button>
                <Button className={classes.signOutButton} color="secondary" onClick={() => firebase.auth().signOut()}>Sign Out</Button>
            </div>
        )
  }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired
}


export default (withStyles(styles)(Home));
