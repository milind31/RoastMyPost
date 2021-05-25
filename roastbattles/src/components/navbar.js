//React
import React, { Component } from 'react';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";

//Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

//Redux
import { userLoggedOut } from './actions/index';
import { connect } from 'react-redux';

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
    constructor(props) {
        super(props);

        this.onSignOut = this.onSignOut.bind(this);
    }

    onSignOut() {
        firebase.auth().signOut();
        this.props.userLoggedOut();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button className={classes.signOutButton} color="secondary" onClick={() => this.onSignOut()}>Sign Out</Button>
                <a href='/'><img className={classes.homeButton} src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogo.png?alt=media&token=90d7f233-e25c-48c0-968a-e9cfa4597a6f"/></a>
            </div>
            );
    }
};

Nav.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({

})

const mapActionsToProps = {
  userLoggedOut
}


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Nav));