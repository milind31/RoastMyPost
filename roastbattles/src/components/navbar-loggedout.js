//React
import React, { Component } from 'react';

//Material UI
import Button from '@material-ui/core/Button';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import NotificationsIcon from '@material-ui/icons/Notifications';
import withStyles from '@material-ui/core/styles/withStyles';

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
}

class NavLoggedOut extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.topRight}>
                    <Button color="secondary" onClick={() => window.location = '/signin'}><NotificationsIcon/></Button>
                    <Button color="primary" onClick={() => window.location = '/signin'}><BookmarksIcon/></Button>
                </div>
                <a href='/'><img className={classes.homeButton} 
                src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogosmall.png?alt=media&token=6762f1df-27ea-4d4a-a559-ff87678cac04"
                 alt="home button"/></a>
            </div>
            );
    }
};

export default withStyles(styles)(NavLoggedOut);