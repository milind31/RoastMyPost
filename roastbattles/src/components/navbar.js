//React
import React, { Component } from 'react';

//Firebase
import firebase from 'firebase/app';
import "firebase/auth";

//Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import NotificationsIcon from '@material-ui/icons/Notifications';

//React Bootstrap
import Dropdown from 'react-bootstrap/Dropdown';

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
}

class Nav extends Component {
    constructor(props) {
        super(props);

        this.state = {userID: '', notifcations: []}


        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
        console.log(this.state.notifcations);
    }

    handleAuthChange(user) {
        if (user) {
            firebase.firestore().collection("notifications").where("to", "==", user.uid).get()
            .then((data) => {
                var notifications = [];
                data.forEach((doc) => {
                    console.log(doc.id)
                    const notification = { 
                        comment: doc.data().comment,
                        reply: doc.data().reply,
                        from: doc.data().from,
                        to: doc.data().to,
                        timeStamp: doc.data().timeStamp.toDate(),
                    }
                    notifications.push(notification);
                })
                return notifications
            })
            .then((notifications) => {
                this.setState({notifications: notifications}, () => {/* figure this out... */});
            })
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    onSignOut() {
        firebase.auth().signOut();
        this.props.userLoggedOut();
    }

    CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Button color="secondary"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }} 
        ><Badge badgeContent={1} color="primary"><NotificationsIcon/></Badge>
            {children}
        </Button>
      ));

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.topRight}>
                    <Dropdown style={{float:'left', margin: '0px', padding: '0px'}}>
                        <Dropdown.Toggle  as={this.CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.state.notifcations.map((notification) => (
                                <Dropdown.Item href="notification">{notification.comment ? "Comment" : "Reply"} from {notification.from}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button color="primary" onClick={() => window.location = '/saved'}><BookmarksIcon/></Button>
                    <Button color="secondary" onClick={() => this.onSignOut()}>Sign Out</Button>
                </div>
                <a href='/'><img className={classes.homeButton} src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogosmall.png?alt=media&token=6762f1df-27ea-4d4a-a559-ff87678cac04"/></a>
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