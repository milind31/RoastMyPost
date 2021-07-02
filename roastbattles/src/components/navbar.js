//React
import React, { Component } from 'react';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";

//Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import BookmarksIcon from '@material-ui/icons/Bookmarks';


//Redux
import { userLoggedOut } from './actions/index';
import { connect } from 'react-redux';

const styles = {
    homeButton: {
        position: "absolute",
        top: "10px",
        left: "10px",
    },
    topRight: {
        position: "absolute",
        top: "20px",
        right: "20px",
        padding: "0px",
        margin: "0px"
    },
    dropdownItem: {
        background: "white"
    },
    container: {
        background: "#333131"
    },
}

class Nav extends Component {
    constructor(props) {
        super(props);

        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user hasn't created username yet
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    onSignOut() {
        firebase.auth().signOut();
        this.props.userLoggedOut();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.topRight}>
                    <Button color="primary" onClick={() => window.location = '/saved'}><BookmarksIcon/></Button>
                    <Button color="secondary" onClick={() => this.onSignOut()}>Sign Out</Button>
                </div>
                <a href='/'><img className={classes.homeButton} 
                src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogosmall.png?alt=media&token=6762f1df-27ea-4d4a-a559-ff87678cac04"
                 alt="home button"/></a>
            </div>
            );
    }
};

Nav.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    username: state.username
})

const mapActionsToProps = {
  userLoggedOut
}


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Nav));