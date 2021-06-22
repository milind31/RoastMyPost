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
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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
    dropdownItem: {
        background: "white"
    },
    container: {
        background: "#333131"
    },
}

class NavWithNotifications extends Component {
    constructor(props) {
        super(props);

        this.state = {userID: '', notifications: []}


        this.handleAuthChange = this.handleAuthChange.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(this.handleAuthChange);
    }

    handleAuthChange(user) {
        if (user) {
            firebase.firestore().collection("notifications").where("to", "==", user.uid).get()
            .then((data) => {
                var notifications = [];
                data.forEach((doc) => {
                    console.log(doc.id)
                    const notification = { 
                        id: doc.id,
                        comment: doc.data().comment,
                        reply: doc.data().reply,
                        from: doc.data().from,
                        to: doc.data().to,
                        post: doc.data().post,
                        timeStamp: doc.data().timeStamp.toDate(),
                    }
                    notifications.push(notification);
                })
                return notifications
            })
            .then((notifications) => {
                this.setState({notifications: notifications}, function(){this.setState({...this.state})});
            })
        } else {
            //user is not logged in
            window.location = '/signin';
        }
    }

    removeNotification(e, id) {
        e.preventDefault();

        firebase.firestore().collection("notifications").doc(id).delete().then(() => {
            console.log("Notification Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing notification document: ", error);
        });

        let notifications = this.state.notifications;
        notifications = notifications.filter(function( obj ) {
            return obj.id !== id;
        });
        this.setState({notifications: notifications});
    }

    onSignOut() {
        this.props.userLoggedOut();
        firebase.auth().signOut();
    }

    CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        
        <Button color="secondary"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }} 
        ><Badge badgeContent={this.state.notifications.length} color="primary"><NotificationsIcon/></Badge>
            {children}
        </Button>
      ));

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.topRight}>
                    <Dropdown style={{float:'left', margin: '0px', padding: '0px'}}>
                        <Dropdown.Toggle  as={this.CustomToggle} id="dropdown-basic"></Dropdown.Toggle>
                        { this.state.notifications.length > 0 ? (
                        <Dropdown.Menu style={{maxHeight: '250px', maxWidth: '500px', overflowY: 'scroll', textAlign: 'center'}}>
                            {this.state.notifications.map((notification) => (
                                <div className={classes.dropdownItem}>
                                    {
                                        notification.comment ? 
                                        (<Dropdown.Item style={{padding:'0px 0px 0px 10px', marginTop: '0px', fontSize: '75%'}} href={"/posts/" + notification.post}>{notification.from} commented on your post!   
                                            <small style={{fontSize:'75%', padding:'5px'}}>{notification.timeStamp.toString().replace( /\d{2}:.*/,"")}</small>
                                        </Dropdown.Item>
                                        )
                                        : 
                                        (
                                        <Dropdown.Item style={{padding:'0px 0px 0px 10px', marginTop: '0px', fontSize: '75%'}} href={"/posts/" + notification.post}>{notification.from} replied to your comment!   
                                            <small style={{fontSize:'75%', padding:'5px'}}>{notification.timeStamp.toString().replace( /\d{2}:.*/,"")}</small>
                                        </Dropdown.Item>
                                        )
                                    }
                                    <Button style={{marginBottom:'-5px'}} onClick={(e) => this.removeNotification(e, notification.id)}><DeleteForeverIcon/></Button>
                                    <hr style={{marginBottom:'-5px'}}/>
                                </div>
                            ))}
                        </Dropdown.Menu>
                        ) :
                        (
                        <Dropdown.Menu>
                            <Dropdown.Item style={{padding:'10px', marginTop: '0px', fontSize: '75%'}} >You have no notifications, you absolute loser</Dropdown.Item>
                        </Dropdown.Menu>
                        )
                        }
                    </Dropdown>
                    <Button color="primary" onClick={() => window.location = '/saved'}><BookmarksIcon/></Button>
                    <Button color="secondary" onClick={() => this.onSignOut()}>Sign Out</Button>
                </div>
                <a href='/'><img className={classes.homeButton} src="https://firebasestorage.googleapis.com/v0/b/roastbattles-85b35.appspot.com/o/roastlogosmall.png?alt=media&token=6762f1df-27ea-4d4a-a559-ff87678cac04"/></a>
            </div>
            );
    }
};

NavWithNotifications.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    username: state.username
})

const mapActionsToProps = {userLoggedOut}


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(NavWithNotifications));