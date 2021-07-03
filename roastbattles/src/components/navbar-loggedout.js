//React
import React, { Component } from 'react';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";

//Material UI
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
    homeButton: {
        position: "absolute",
        top: "10px",
        left: "10px",
    }
}

class NavLoggedOut extends Component {
    constructor(props) {
        super(props);

        this.handleAuthChange = this.handleAuthChange.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            //user hasn't created username yet
        } else {
            //user is not logged in
        }
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <a href='/'><img className={classes.homeButton} 
                src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogosmall.png?alt=media&token=6762f1df-27ea-4d4a-a559-ff87678cac04"
                 alt="home button"/></a>
            </div>
            );
    }
};

export default withStyles(styles)(NavLoggedOut);