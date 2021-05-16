import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/auth";

const styles = {
    button: {
        margin: "10px",
    }
}

//homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {createdPost: false};

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
                this.setState({createdPost: docData.data().createdPost})
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
                <Button className={classes.button} color="secondary" variant="outlined" onClick={() => firebase.auth().signOut()}>Sign Out</Button>
                {this.state.createdPost ? <Button  onClick={() => window.location = '/posts/' /*TODO: ADD POST ID THROUGH PROPS*/ } variant="outlined" color="primary">View Post</Button> : <Button onClick={() => window.location = '/create-post' }variant="outlined" color="primary">Create Post</Button>}
            </div>
        )
  }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired
}


export default (withStyles(styles)(Home));
