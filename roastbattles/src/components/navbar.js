import React, { Component } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const styles = {
    homeButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "3%",
        height: "auto"
    },
    signOutButton: {
        position: "absolute",
        top: "20px",
        right: "20px"
    },
}

class Nav extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button className={classes.signOutButton} color="secondary" onClick={() => firebase.auth().signOut()}>Sign Out</Button>
                <a href='/'><img className={classes.homeButton} src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogo.png?alt=media&token=90d7f233-e25c-48c0-968a-e9cfa4597a6f"/></a>
            </div>
            );
    }
};

Nav.propTypes = {
    classes: PropTypes.object.isRequired
}

export default (withStyles(styles)(Nav));